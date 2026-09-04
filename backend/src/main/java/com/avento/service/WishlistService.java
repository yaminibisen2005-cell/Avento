package com.avento.service;

import com.avento.dto.WishlistDto;
import com.avento.entity.User;

import java.util.List;

public interface WishlistService {
    List<WishlistDto> getWishlist(User user);
    WishlistDto addToWishlist(Long eventId, User user);
    void removeFromWishlist(Long eventId, User user);
    boolean isWishlisted(Long eventId, User user);
}
