package com.avento.service.impl;

import com.avento.dto.*;
import com.avento.entity.Notification;
import com.avento.entity.User;
import com.avento.repository.*;
import com.avento.service.EventService;
import com.avento.service.RegistrationService;
import com.avento.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationRepository notificationRepository;
    private final RegistrationService registrationService;
    private final EventService eventService;

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(User user) {
        List<RegistrationResponse> registrations = registrationService.getStudentRegistrations(user);
        List<TicketDto> tickets = registrationService.getStudentTickets(user);
        List<CertificateDto> certificates = getStudentCertificates(user);
        List<EventDto> exploreEvents = eventService.getExploreEvents(null, null);

        long registeredCount = registrations.size();
        long upcomingCount = registrations.stream().filter(r -> "Upcoming".equalsIgnoreCase(r.getStatus())).count();
        long certificatesCount = certificates.size();
        int attendanceRate = 96;

        Map<String, Object> stats = new HashMap<>();
        stats.put("registeredEvents", registeredCount);
        stats.put("upcomingEvents", upcomingCount);
        stats.put("certificatesEarned", certificatesCount);
        stats.put("attendanceRate", attendanceRate);

        List<Notification> notifs = getStudentNotifications(user);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, HH:mm");
        List<Map<String, Object>> notifList = notifs.stream().map(n -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", String.valueOf(n.getId()));
            m.put("title", n.getTitle());
            m.put("message", n.getMessage());
            m.put("time", n.getCreatedAt() != null ? n.getCreatedAt().format(fmt) : "Just now");
            m.put("read", n.getIsRead());
            m.put("type", n.getType());
            return m;
        }).collect(Collectors.toList());

        return StudentDashboardResponse.builder()
                .stats(stats)
                .upcomingEvents(tickets)
                .exploreEvents(exploreEvents)
                .registrations(registrations)
                .certificates(certificates)
                .notifications(notifList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificateDto> getStudentCertificates(User user) {
        return certificateRepository.findByUserOrderByIssuedAtDesc(user).stream()
                .map(CertificateDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getStudentNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    @Transactional
    public User updateStudentProfile(User user, UpdateProfileRequest req) {
        if (req.getFullName() != null && !req.getFullName().trim().isEmpty()) {
            user.setFullName(req.getFullName().trim());
        }
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(req.getPhoneNumber().trim());
        }
        if (req.getCollege() != null) user.setCollege(req.getCollege());
        if (req.getBranch() != null) user.setBranch(req.getBranch());
        if (req.getYear() != null) user.setYear(req.getYear());
        if (req.getRollNumber() != null) user.setRollNumber(req.getRollNumber());
        if (req.getEmergencyContact() != null) user.setEmergencyContact(req.getEmergencyContact());
        if (req.getProfileImage() != null) user.setProfileImage(req.getProfileImage());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getDob() != null) user.setDob(req.getDob());
        if (req.getCity() != null) user.setCity(req.getCity());
        if (req.getState() != null) user.setState(req.getState());
        if (req.getLinkedin() != null) user.setLinkedin(req.getLinkedin());
        if (req.getGithub() != null) user.setGithub(req.getGithub());
        if (req.getSkills() != null) user.setSkills(req.getSkills());

        return userRepository.save(user);
    }
}
