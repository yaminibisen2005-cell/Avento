package com.avento.service.impl;

import com.avento.dto.CreateEventRequest;
import com.avento.dto.EventDto;
import com.avento.entity.Event;
import com.avento.entity.Role;
import com.avento.entity.User;
import com.avento.exception.BadRequestException;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.EventRepository;
import com.avento.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getExploreEvents(String category, String query) {
        List<Event> events;
        if (query != null && !query.trim().isEmpty()) {
            events = eventRepository.searchEvents(query.trim(), "PUBLISHED");
        } else if (category != null && !category.trim().equalsIgnoreCase("All")) {
            events = eventRepository.findByCategoryAndStatus(category.trim(), "PUBLISHED");
        } else {
            events = eventRepository.findByStatusOrderByCreatedAtDesc("PUBLISHED");
        }

        return events.stream().map(EventDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getFilteredEvents(String category, String query, String mode, String priceTier, String college, String sort) {
        List<Event> events = eventRepository.findByStatusOrderByCreatedAtDesc("PUBLISHED");

        return events.stream()
                .filter(e -> {
                    if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
                        if (!category.equalsIgnoreCase(e.getCategory())) return false;
                    }
                    if (query != null && !query.isBlank()) {
                        String q = query.trim().toLowerCase();
                        boolean match = e.getTitle().toLowerCase().contains(q) ||
                                (e.getVenue() != null && e.getVenue().toLowerCase().contains(q)) ||
                                (e.getCategory() != null && e.getCategory().toLowerCase().contains(q));
                        if (!match) return false;
                    }
                    if (mode != null && !mode.isBlank() && !mode.equalsIgnoreCase("All")) {
                        if (e.getMode() == null || !e.getMode().equalsIgnoreCase(mode)) return false;
                    }
                    if (priceTier != null && !priceTier.isBlank() && !priceTier.equalsIgnoreCase("All")) {
                        boolean isFree = e.getFee() == null || e.getFee().equalsIgnoreCase("Free") || e.getFee().equals("₹0");
                        if ("free".equalsIgnoreCase(priceTier) && !isFree) return false;
                        if ("paid".equalsIgnoreCase(priceTier) && isFree) return false;
                        if ("under500".equalsIgnoreCase(priceTier)) {
                            long amt = 0;
                            try {
                                amt = Long.parseLong(e.getFee().replaceAll("[^0-9]", ""));
                            } catch (Exception ignored) {}
                            if (amt > 500) return false;
                        }
                    }
                    if (college != null && !college.isBlank() && !college.equalsIgnoreCase("All")) {
                        String c = college.toLowerCase();
                        boolean match = (e.getVenue() != null && e.getVenue().toLowerCase().contains(c)) ||
                                (e.getOrganizer() != null && e.getOrganizer().getCollege() != null && e.getOrganizer().getCollege().toLowerCase().contains(c));
                        if (!match) return false;
                    }
                    return true;
                })
                .sorted((e1, e2) -> {
                    if ("popular".equalsIgnoreCase(sort)) {
                        int s1 = e1.getSeatsFilled() != null ? e1.getSeatsFilled() : 0;
                        int s2 = e2.getSeatsFilled() != null ? e2.getSeatsFilled() : 0;
                        return Integer.compare(s2, s1);
                    }
                    if ("feeAsc".equalsIgnoreCase(sort)) {
                        long a1 = parseFeeToNumber(e1.getFee());
                        long a2 = parseFeeToNumber(e2.getFee());
                        return Long.compare(a1, a2);
                    }
                    if ("feeDesc".equalsIgnoreCase(sort)) {
                        long a1 = parseFeeToNumber(e1.getFee());
                        long a2 = parseFeeToNumber(e2.getFee());
                        return Long.compare(a2, a1);
                    }
                    // default: newest
                    return 0;
                })
                .map(EventDto::fromEntity)
                .collect(Collectors.toList());
    }

    private long parseFeeToNumber(String fee) {
        if (fee == null || fee.equalsIgnoreCase("Free") || fee.equals("₹0")) return 0L;
        try {
            return Long.parseLong(fee.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return EventDto.fromEntity(event);
    }

    @Override
    @Transactional
    public EventDto createEvent(CreateEventRequest req, User organizer) {
        String status = req.getStatus() != null && !req.getStatus().trim().isEmpty() ?
                req.getStatus() : "PUBLISHED";

        Event event = Event.builder()
                .title(req.getTitle())
                .subtitle(req.getSubtitle())
                .category(req.getCategory())
                .mode(req.getMode() != null ? req.getMode() : "In-Person")
                .difficulty(req.getDifficulty() != null ? req.getDifficulty() : "All Levels")
                .venue(req.getVenue())
                .date(req.getDate())
                .time(req.getTime() != null ? req.getTime() : "09:00 AM - 06:00 PM IST")
                .registrationDeadline(req.getRegistrationDeadline())
                .countdownTarget(req.getCountdownTarget())
                .image(req.getImage() != null && !req.getImage().isEmpty() ? req.getImage() :
                        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80")
                .shortDescription(req.getShortDescription())
                .description(req.getDescription())
                .learningOutcomesJson(req.getLearningOutcomesJson())
                .whyAttendJson(req.getWhyAttendJson())
                .timelineJson(req.getTimelineJson())
                .speakersJson(req.getSpeakersJson())
                .seatsTotal(req.getSeatsTotal() != null ? req.getSeatsTotal() : 200)
                .seatsFilled(0)
                .fee(req.getFee() != null ? req.getFee() : "Free")
                .status(status)
                .organizer(organizer)
                .build();

        Event saved = eventRepository.save(event);
        return EventDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public EventDto updateEvent(Long id, CreateEventRequest req, User user) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (user.getRole() != Role.ADMIN && (event.getOrganizer() == null || !event.getOrganizer().getId().equals(user.getId()))) {
            throw new BadRequestException("Unauthorized: You do not own this event.");
        }

        if (req.getTitle() != null) event.setTitle(req.getTitle());
        if (req.getSubtitle() != null) event.setSubtitle(req.getSubtitle());
        if (req.getCategory() != null) event.setCategory(req.getCategory());
        if (req.getMode() != null) event.setMode(req.getMode());
        if (req.getDifficulty() != null) event.setDifficulty(req.getDifficulty());
        if (req.getVenue() != null) event.setVenue(req.getVenue());
        if (req.getDate() != null) event.setDate(req.getDate());
        if (req.getTime() != null) event.setTime(req.getTime());
        if (req.getImage() != null) event.setImage(req.getImage());
        if (req.getDescription() != null) event.setDescription(req.getDescription());
        if (req.getFee() != null) event.setFee(req.getFee());
        if (req.getStatus() != null) event.setStatus(req.getStatus());
        if (req.getSeatsTotal() != null) event.setSeatsTotal(req.getSeatsTotal());

        Event saved = eventRepository.save(event);
        return EventDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id, User user) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (user.getRole() != Role.ADMIN && (event.getOrganizer() == null || !event.getOrganizer().getId().equals(user.getId()))) {
            throw new BadRequestException("Unauthorized: You cannot delete this event.");
        }

        eventRepository.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getOrganizerEvents(User organizer) {
        return eventRepository.findByOrganizerOrderByCreatedAtDesc(organizer)
                .stream().map(EventDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getPendingEvents() {
        return eventRepository.findByStatusOrderByCreatedAtDesc("PENDING")
                .stream().map(EventDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventDto approveEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        event.setStatus("PUBLISHED");
        Event saved = eventRepository.save(event);
        return EventDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public void rejectEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        event.setStatus("CANCELLED");
        eventRepository.save(event);
    }
}
