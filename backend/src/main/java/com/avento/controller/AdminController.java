package com.avento.controller;

import com.avento.dto.AdminDashboardResponse;
import com.avento.dto.AnnouncementRequest;
import com.avento.dto.EventDto;
import com.avento.dto.UserResponse;
import com.avento.entity.Announcement;
import com.avento.entity.Payment;
import com.avento.entity.User;
import com.avento.service.AdminService;
import com.avento.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final EventService eventService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse res = adminService.getAdminDashboard();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<UserResponse> toggleBlockUser(@PathVariable Long id) {
        UserResponse res = adminService.toggleBlockUser(id);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/organizers/{id}/approve")
    public ResponseEntity<UserResponse> approveOrganizer(@PathVariable Long id) {
        UserResponse res = adminService.approveOrganizer(id);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/organizers/{id}/reject")
    public ResponseEntity<Void> rejectOrganizer(@PathVariable Long id) {
        adminService.rejectOrganizer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/pending")
    public ResponseEntity<List<EventDto>> getPendingEvents() {
        List<EventDto> pending = eventService.getPendingEvents();
        return ResponseEntity.ok(pending);
    }

    @PutMapping("/events/{id}/approve")
    public ResponseEntity<EventDto> approveEvent(@PathVariable Long id) {
        EventDto approved = eventService.approveEvent(id);
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/events/{id}/reject")
    public ResponseEntity<Void> rejectEvent(@PathVariable Long id) {
        eventService.rejectEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getPayments() {
        List<Payment> payments = adminService.getPayments();
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/payments/{txnId}/refund")
    public ResponseEntity<Payment> refundPayment(@PathVariable String txnId) {
        Payment refunded = adminService.refundPayment(txnId);
        return ResponseEntity.ok(refunded);
    }

    @GetMapping("/reports")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam(defaultValue = "CSV") String format,
            @RequestParam(defaultValue = "monthly") String timeframe
    ) {
        byte[] data = adminService.generateReport(format, timeframe);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=avento-report-" + timeframe + "." + format.toLowerCase())
                .contentType(MediaType.TEXT_PLAIN)
                .body(data);
    }

    @PostMapping("/announcements")
    public ResponseEntity<Announcement> createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Announcement announcement = adminService.createAnnouncement(request, currentUser);
        return ResponseEntity.ok(announcement);
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(adminService.getAnnouncements());
    }
}
