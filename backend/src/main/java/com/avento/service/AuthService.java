package com.avento.service;

import com.avento.dto.MessageResponse;
import com.avento.dto.SyncUserRequest;
import com.avento.dto.UserResponse;

import java.util.List;

public interface AuthService {
    UserResponse syncUser(SyncUserRequest request);
    UserResponse getProfile(String email);
    MessageResponse logout();
    UserResponse approveOrganizer(Long userId);
    List<UserResponse> getPendingOrganizers();
}
