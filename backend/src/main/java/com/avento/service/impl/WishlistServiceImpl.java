package com.avento.service.impl;

import com.avento.dto.WishlistDto;
import com.avento.entity.Event;
import com.avento.entity.User;
import com.avento.entity.WishlistItem;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.EventRepository;
import com.avento.repository.WishlistRepository;
import com.avento.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistDto> getWishlist(User user) {
        return wishlistRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(WishlistDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WishlistDto addToWishlist(Long eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        return wishlistRepository.findByUserAndEvent(user, event)
                .map(WishlistDto::fromEntity)
                .orElseGet(() -> {
                    WishlistItem item = WishlistItem.builder()
                            .user(user)
                            .event(event)
                            .build();
                    WishlistItem saved = wishlistRepository.save(item);
                    return WishlistDto.fromEntity(saved);
                });
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));
        wishlistRepository.deleteByUserAndEvent(user, event);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isWishlisted(Long eventId, User user) {
        return eventRepository.findById(eventId)
                .map(event -> wishlistRepository.existsByUserAndEvent(user, event))
                .orElse(false);
    }
}
