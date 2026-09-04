package com.avento.controller;

import com.avento.dto.AttendanceScanRequest;
import com.avento.dto.AttendanceScanResponse;
import com.avento.dto.CertificateDto;
import com.avento.dto.EventDto;
import com.avento.dto.OrganizerDashboardResponse;
import com.avento.dto.RegistrationResponse;
import com.avento.entity.Notification;
import com.avento.entity.User;
import com.avento.service.EventService;
import com.avento.service.OrganizerService;
import com.avento.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrganizerController {

    private final OrganizerService organizerService;
    private final EventService eventService;
    private final RegistrationService registrationService;

    @GetMapping("/organizer/dashboard")
    public ResponseEntity<OrganizerDashboardResponse> getDashboard(
            @AuthenticationPrincipal User currentUser
    ) {
        OrganizerDashboardResponse dashboard = organizerService.getOrganizerDashboard(currentUser);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/organizer/events")
    public ResponseEntity<List<EventDto>> getMyEvents(
            @AuthenticationPrincipal User currentUser
    ) {
        List<EventDto> events = eventService.getOrganizerEvents(currentUser);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/organizer/events/{id}/registrations")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        List<RegistrationResponse> list = registrationService.getEventRegistrations(id, currentUser);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/attendance/scan")
    public ResponseEntity<AttendanceScanResponse> scanAttendance(
            @Valid @RequestBody AttendanceScanRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        AttendanceScanResponse response = organizerService.scanAttendance(request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/certificates/generate")
    public ResponseEntity<CertificateDto> generateCertificate(
            @RequestParam Long eventId,
            @RequestParam Long userId,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String score
    ) {
        CertificateDto cert = organizerService.generateCertificate(eventId, userId, grade, score);
        return ResponseEntity.ok(cert);
    }

    @GetMapping("/organizer/revenue")
    public ResponseEntity<Map<String, Object>> getRevenue(
            @AuthenticationPrincipal User currentUser
    ) {
        Map<String, Object> revenue = organizerService.getOrganizerRevenue(currentUser);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/organizer/notifications")
    public ResponseEntity<List<Notification>> getNotifications(
            @AuthenticationPrincipal User currentUser
    ) {
        List<Notification> notifs = organizerService.getOrganizerNotifications(currentUser);
        return ResponseEntity.ok(notifs);
    }
}
