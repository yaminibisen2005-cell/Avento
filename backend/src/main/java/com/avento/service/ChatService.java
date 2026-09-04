package com.avento.service;

import com.avento.dto.ChatMessageDto;
import com.avento.dto.SendMessageRequest;
import com.avento.entity.User;

import java.util.List;
import java.util.Map;

public interface ChatService {
    List<Map<String, Object>> getConversations(User user);
    List<ChatMessageDto> getMessageHistory(Long otherUserId, User user);
    ChatMessageDto sendMessage(SendMessageRequest req, User user);
    void markAsRead(Long otherUserId, User user);
}
