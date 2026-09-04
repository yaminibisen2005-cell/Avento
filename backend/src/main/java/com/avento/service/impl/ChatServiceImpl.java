package com.avento.service.impl;

import com.avento.dto.ChatMessageDto;
import com.avento.dto.SendMessageRequest;
import com.avento.entity.ChatMessage;
import com.avento.entity.Event;
import com.avento.entity.User;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.ChatMessageRepository;
import com.avento.repository.EventRepository;
import com.avento.repository.UserRepository;
import com.avento.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getConversations(User user) {
        List<User> partners = chatMessageRepository.findDistinctChatPartners(user);

        // If no conversations exist, populate default support contacts (Admin & Top Organizer)
        if (partners.isEmpty()) {
            userRepository.findByEmail("admin@avento.com").ifPresent(partners::add);
            userRepository.findByEmail("organizer@avento.com").ifPresent(partners::add);
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (User p : partners) {
            if (p.getId().equals(user.getId())) continue;

            List<ChatMessage> history = chatMessageRepository.findChatHistoryBetweenUsers(user, p);
            String lastMsg = !history.isEmpty() ? history.get(history.size() - 1).getMessage() : "Hi! How can we assist you with AVENTO today?";
            String time = !history.isEmpty() && history.get(history.size() - 1).getCreatedAt() != null ?
                    history.get(history.size() - 1).getCreatedAt().toString().substring(11, 16) : "Online";

            Map<String, Object> map = new HashMap<>();
            map.put("partnerId", p.getId());
            map.put("name", p.getFullName());
            map.put("role", p.getRole().name());
            map.put("college", p.getCollege() != null ? p.getCollege() : "AVENTO Support");
            map.put("avatar", p.getProfileImage());
            map.put("lastMessage", lastMsg);
            map.put("time", time);
            map.put("unreadCount", 0);
            list.add(map);
        }
        return list;
    }

    @Override
    @Transactional
    public List<ChatMessageDto> getMessageHistory(Long otherUserId, User user) {
        User partner = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + otherUserId));

        List<ChatMessage> list = chatMessageRepository.findChatHistoryBetweenUsers(user, partner);

        // Mark incoming messages as read
        for (ChatMessage m : list) {
            if (m.getRecipient().getId().equals(user.getId()) && !"READ".equals(m.getStatus())) {
                m.setStatus("READ");
                chatMessageRepository.save(m);
            }
        }

        return list.stream()
                .map(m -> ChatMessageDto.fromEntity(m, user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageDto sendMessage(SendMessageRequest req, User user) {
        User recipient = userRepository.findById(req.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + req.getRecipientId()));

        Event event = null;
        if (req.getEventId() != null) {
            event = eventRepository.findById(req.getEventId()).orElse(null);
        }

        ChatMessage message = ChatMessage.builder()
                .sender(user)
                .recipient(recipient)
                .event(event)
                .message(req.getMessage())
                .status("SENT")
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        return ChatMessageDto.fromEntity(saved, user.getId());
    }

    @Override
    @Transactional
    public void markAsRead(Long otherUserId, User user) {
        User partner = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + otherUserId));

        List<ChatMessage> list = chatMessageRepository.findChatHistoryBetweenUsers(user, partner);
        for (ChatMessage m : list) {
            if (m.getRecipient().getId().equals(user.getId())) {
                m.setStatus("READ");
                chatMessageRepository.save(m);
            }
        }
    }
}
