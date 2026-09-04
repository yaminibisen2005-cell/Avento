package com.avento.controller;

import com.avento.dto.*;
import com.avento.entity.Notification;
import com.avento.entity.User;
import com.avento.service.RegistrationService;
import com.avento.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final RegistrationService registrationService;

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(
            @AuthenticationPrincipal User currentUser
    ) {
        StudentDashboardResponse dashboard = studentService.getStudentDashboard(currentUser);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<RegistrationResponse>> getRegistrations(
            @AuthenticationPrincipal User currentUser
    ) {
        List<RegistrationResponse> list = registrationService.getStudentRegistrations(currentUser);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDto>> getTickets(
            @AuthenticationPrincipal User currentUser
    ) {
        List<TicketDto> tickets = registrationService.getStudentTickets(currentUser);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<CertificateDto>> getCertificates(
            @AuthenticationPrincipal User currentUser
    ) {
        List<CertificateDto> certificates = studentService.getStudentCertificates(currentUser);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(
            @AuthenticationPrincipal User currentUser
    ) {
        List<Notification> notifications = studentService.getStudentNotifications(currentUser);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        User updated = studentService.updateStudentProfile(currentUser, request);
        return ResponseEntity.ok(UserResponse.fromUser(updated));
    }
}
