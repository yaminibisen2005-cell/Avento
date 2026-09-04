package com.avento.dto;

import com.avento.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private String recipientName;
    private Long eventId;
    private String message;
    private String status;
    private String timestamp;
    private boolean isSelf;

    public static ChatMessageDto fromEntity(ChatMessage m, Long currentUserId) {
        if (m == null) return null;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("hh:mm a");
        String timeStr = m.getCreatedAt() != null ? m.getCreatedAt().format(fmt) : "Just now";

        return ChatMessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFullName())
                .recipientId(m.getRecipient().getId())
                .recipientName(m.getRecipient().getFullName())
                .eventId(m.getEvent() != null ? m.getEvent().getId() : null)
                .message(m.getMessage())
                .status(m.getStatus())
                .timestamp(timeStr)
                .isSelf(m.getSender().getId().equals(currentUserId))
                .build();
    }
}
