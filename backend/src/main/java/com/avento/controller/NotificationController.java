package com.avento.controller;

import com.avento.dto.MessageResponse;
import com.avento.dto.NotificationDto;
import com.avento.entity.Notification;
import com.avento.entity.User;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(@AuthenticationPrincipal User user) {
        List<Notification> list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        List<NotificationDto> dtos = list.stream().map(NotificationDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        long count = notificationRepository.countByUserAndIsReadFalse(user);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<MessageResponse> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);

        return ResponseEntity.ok(MessageResponse.ok("Marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<MessageResponse> markAllAsRead(@AuthenticationPrincipal User user) {
        List<Notification> unread = notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(n -> Boolean.FALSE.equals(n.getIsRead()))
                .toList();

        for (Notification n : unread) {
            n.setIsRead(true);
            n.setReadAt(LocalDateTime.now());
            notificationRepository.save(n);
        }

        return ResponseEntity.ok(MessageResponse.ok("All marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notificationRepository.delete(notification);
        return ResponseEntity.ok(MessageResponse.ok("Notification deleted"));
    }
}
