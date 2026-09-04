package com.avento.controller;

import com.avento.dto.MessageResponse;
import com.avento.dto.WishlistDto;
import com.avento.entity.User;
import com.avento.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistDto>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<WishlistDto> addToWishlist(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(wishlistService.addToWishlist(eventId, user));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<MessageResponse> removeFromWishlist(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user
    ) {
        wishlistService.removeFromWishlist(eventId, user);
        return ResponseEntity.ok(MessageResponse.ok("Removed from wishlist"));
    }

    @GetMapping("/check/{eventId}")
    public ResponseEntity<Map<String, Boolean>> isWishlisted(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user
    ) {
        boolean exists = wishlistService.isWishlisted(eventId, user);
        return ResponseEntity.ok(Map.of("isWishlisted", exists));
    }
}
