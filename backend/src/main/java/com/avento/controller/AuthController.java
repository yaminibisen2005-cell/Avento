package com.avento.controller;

import com.avento.dto.*;
import com.avento.entity.User;
import com.avento.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sync")
    public ResponseEntity<UserResponse> syncUser(@RequestBody SyncUserRequest syncRequest) {
        UserResponse userResponse = authService.syncUser(syncRequest);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponse userResponse = authService.getProfile(currentUser.getEmail());
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logoutUser() {
        MessageResponse response = authService.logout();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/approve/{userId}")
    public ResponseEntity<UserResponse> approveOrganizer(@PathVariable Long userId) {
        UserResponse response = authService.approveOrganizer(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-organizers")
    public ResponseEntity<List<UserResponse>> getPendingOrganizers() {
        return ResponseEntity.ok(authService.getPendingOrganizers());
    }
}
