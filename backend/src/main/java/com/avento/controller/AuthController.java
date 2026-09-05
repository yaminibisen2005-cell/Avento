package com.avento.controller;

import com.avento.dto.*;
import com.avento.entity.User;
import com.avento.service.AuthService;
import com.avento.service.StudentService;
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
    private final StudentService studentService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@jakarta.validation.Valid @RequestBody LoginRequest loginRequest) {
        UserResponse userResponse = authService.login(loginRequest);
        return ResponseEntity.ok(userResponse);
    }

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

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User updated = studentService.updateStudentProfile(currentUser, request);
        return ResponseEntity.ok(UserResponse.fromUser(updated));
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
