package com.avento.service.impl;

import com.avento.dto.RegistrationRequest;
import com.avento.dto.RegistrationResponse;
import com.avento.dto.TicketDto;
import com.avento.entity.*;
import com.avento.exception.BadRequestException;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.*;
import com.avento.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
    private final com.avento.service.EmailService emailService;
    private final com.avento.service.AuditLogService auditLogService;

    @Override
    @Transactional
    public RegistrationResponse registerEvent(RegistrationRequest req, User user) {
        // Fallback user resolution: If security principal is null (e.g. dev mode or token bypass),
        // resolve user by studentEmail or create registered student record
        if (user == null) {
            String email = req.getStudentEmail() != null ? req.getStudentEmail().trim().toLowerCase() : null;
            if (email != null) {
                user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    user = User.builder()
                            .email(email)
                            .fullName(req.getStudentName() != null ? req.getStudentName().trim() : email.split("@")[0])
                            .phoneNumber(req.getStudentPhone())
                            .college(req.getCollege())
                            .branch(req.getBranch())
                            .year(req.getYear())
                            .emergencyContact(req.getEmergencyContact())
                            .role(Role.STUDENT)
                            .approved(true)
                            .verified(true)
                            .blocked(false)
                            .build();
                    user = userRepository.save(user);
                }
            } else {
                throw new BadRequestException("Student email is required for registration.");
            }
        }

        Event event = eventRepository.findById(req.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + req.getEventId()));

        if (event.getSeatsTotal() != null && event.getSeatsFilled() != null && event.getSeatsFilled() >= event.getSeatsTotal()) {
            throw new BadRequestException("Event is already fully booked.");
        }

        // Check if already registered
        if (registrationRepository.existsByEventAndUser(event, user)) {
            Registration existing = registrationRepository.findByUserOrderByRegisteredAtDesc(user).stream()
                    .filter(r -> r.getEvent().getId().equals(event.getId()))
                    .findFirst()
                    .orElse(null);
            if (existing != null) {
                Ticket t = ticketRepository.findByRegistration(existing).orElse(null);
                return RegistrationResponse.fromEntity(existing, t != null ? t.getTicketNumber() : "");
            }
        }

        String regNumber = "REG-" + (System.currentTimeMillis() % 100000);
        String studentName = req.getStudentName() != null && !req.getStudentName().trim().isEmpty() ?
                req.getStudentName().trim() : user.getFullName();
        String studentEmail = req.getStudentEmail() != null && !req.getStudentEmail().trim().isEmpty() ?
                req.getStudentEmail().trim() : user.getEmail();

        boolean isFree = event.getFee() == null || event.getFee().equalsIgnoreCase("Free") || event.getFee().equals("₹0");
        String paymentStatus = isFree ? "Paid (₹0 Free Tier)" : "Paid (" + event.getFee() + " Razorpay)";
        String txnId = "TXN-" + (System.currentTimeMillis() % 100000);

        Registration reg = Registration.builder()
                .registrationNumber(regNumber)
                .event(event)
                .user(user)
                .studentName(studentName)
                .studentEmail(studentEmail)
                .studentPhone(req.getStudentPhone() != null ? req.getStudentPhone() : user.getPhoneNumber())
                .college(req.getCollege() != null ? req.getCollege() : user.getCollege())
                .branch(req.getBranch() != null ? req.getBranch() : user.getBranch())
                .year(req.getYear() != null ? req.getYear() : user.getYear())
                .gender(req.getGender() != null ? req.getGender() : "Not Specified")
                .emergencyContact(req.getEmergencyContact() != null ? req.getEmergencyContact() : user.getEmergencyContact())
                .teamName(req.getTeamName())
                .specialRequirements(req.getSpecialRequirements())
                .paymentStatus(paymentStatus)
                .paymentAmount(event.getFee())
                .paymentTxnId(txnId)
                .status("Upcoming")
                .attended(false)
                .build();

        Registration savedReg = registrationRepository.save(reg);

        // Generate Ticket
        String ticketPrefix = event.getCategory() != null && event.getCategory().toUpperCase().contains("HACK") ? "AVT-HACK-" : "AVT-PASS-";
        String ticketNumber = ticketPrefix + (int)(1000 + Math.random() * 9000);
        String qrPayload = "AVENTO:TICKET:" + event.getId() + ":" + studentName.replaceAll(" ", "_") + ":" + ticketNumber;

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .registration(savedReg)
                .event(event)
                .user(user)
                .qrCodePayload(qrPayload)
                .seatNumber("GA-A" + ((savedReg.getId() % 100) + 1))
                .status("Confirmed")
                .build();

        ticketRepository.save(ticket);

        // Record payment
        Payment payment = Payment.builder()
                .txnId(txnId)
                .user(user)
                .event(event)
                .registration(savedReg)
                .ticket(ticket)
                .studentName(studentName)
                .organizerName(event.getOrganizer() != null ? event.getOrganizer().getFullName() : "AVENTO Technical Council")
                .eventTitle(event.getTitle())
                .amount(event.getFee())
                .gateway(isFree ? "Direct Pass" : "Razorpay Standard Checkout")
                .status(PaymentStatus.SUCCESS)
                .build();
        paymentRepository.save(payment);

        // Dispatch Notification
        Notification notification = Notification.builder()
                .user(user)
                .title("Registration Approved")
                .message("Your digital entry pass for " + event.getTitle() + " has been issued (" + ticketNumber + ").")
                .type("ticket")
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // Increment seats filled
        event.setSeatsFilled((event.getSeatsFilled() != null ? event.getSeatsFilled() : 0) + 1);
        eventRepository.save(event);

        // Dispatch Confirmation & Ticket Emails
        emailService.sendRegistrationConfirmation(savedReg, event);
        emailService.sendTicketEmail(ticket, event, user);
        auditLogService.log("REGISTRATION", user.getId(), user.getEmail(), user.getRole().name(), null, "Registered for event: " + event.getTitle() + " (" + ticketNumber + ")");

        return RegistrationResponse.fromEntity(savedReg, ticketNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getStudentRegistrations(User user) {
        return registrationRepository.findByUserOrderByRegisteredAtDesc(user).stream()
                .map(r -> {
                    Ticket t = ticketRepository.findByRegistration(r).orElse(null);
                    return RegistrationResponse.fromEntity(r, t != null ? t.getTicketNumber() : "");
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getEventRegistrations(Long eventId, User organizer) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        return registrationRepository.findByEventOrderByRegisteredAtDesc(event).stream()
                .map(r -> {
                    Ticket t = ticketRepository.findByRegistration(r).orElse(null);
                    return RegistrationResponse.fromEntity(r, t != null ? t.getTicketNumber() : "");
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketDto> getStudentTickets(User user) {
        return ticketRepository.findByUserOrderByIssuedAtDesc(user).stream()
                .map(TicketDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketDto getTicketById(Long id) {
        Ticket t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + id));
        return TicketDto.fromEntity(t);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketDto getTicketByNumber(String ticketNumber) {
        Ticket t = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with number: " + ticketNumber));
        return TicketDto.fromEntity(t);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserRegistered(Long eventId, User user) {
        if (eventId == null || user == null) {
            return false;
        }
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return false;
        }
        return registrationRepository.existsByEventAndUser(event, user);
    }
}
