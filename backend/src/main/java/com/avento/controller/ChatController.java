package com.avento.controller;

import com.avento.dto.ChatMessageDto;
import com.avento.dto.MessageResponse;
import com.avento.dto.SendMessageRequest;
import com.avento.entity.User;
import com.avento.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getConversations(user));
    }

    @GetMapping("/messages/{otherUserId}")
    public ResponseEntity<List<ChatMessageDto>> getMessageHistory(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(chatService.getMessageHistory(otherUserId, user));
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @Valid @RequestBody SendMessageRequest req,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(chatService.sendMessage(req, user));
    }

    @PutMapping("/read/{otherUserId}")
    public ResponseEntity<MessageResponse> markAsRead(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal User user
    ) {
        chatService.markAsRead(otherUserId, user);
        return ResponseEntity.ok(MessageResponse.ok("Messages marked as read"));
    }
}
