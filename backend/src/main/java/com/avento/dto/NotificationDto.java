package com.avento.dto;

import com.avento.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String link;
    private String time;
    private String createdAt;

    public static NotificationDto fromEntity(Notification n) {
        if (n == null) return null;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy • hh:mm a");
        String timeStr = n.getCreatedAt() != null ? n.getCreatedAt().format(fmt) : "Recent";

        return NotificationDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType() != null ? n.getType() : "system")
                .isRead(Boolean.TRUE.equals(n.getIsRead()))
                .link(n.getLink())
                .time(timeStr)
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                .build();
    }
}
