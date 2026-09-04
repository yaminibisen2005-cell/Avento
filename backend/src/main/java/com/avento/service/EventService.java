package com.avento.service;

import com.avento.dto.CreateEventRequest;
import com.avento.dto.EventDto;
import com.avento.entity.User;

import java.util.List;

public interface EventService {

    List<EventDto> getExploreEvents(String category, String query);

    List<EventDto> getFilteredEvents(String category, String query, String mode, String priceTier, String college, String sort);

    EventDto getEventById(Long id);

    EventDto createEvent(CreateEventRequest request, User organizer);

    EventDto updateEvent(Long id, CreateEventRequest request, User user);

    void deleteEvent(Long id, User user);

    List<EventDto> getOrganizerEvents(User organizer);

    List<EventDto> getPendingEvents();

    EventDto approveEvent(Long id);

    void rejectEvent(Long id);
}
