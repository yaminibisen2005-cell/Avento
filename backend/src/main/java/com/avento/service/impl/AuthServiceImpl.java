package com.avento.service.impl;

import com.avento.dto.MessageResponse;
import com.avento.dto.SyncUserRequest;
import com.avento.dto.UserResponse;
import com.avento.entity.Role;
import com.avento.entity.User;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.UserRepository;
import com.avento.service.AuditLogService;
import com.avento.service.AuthService;
import com.avento.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public UserResponse syncUser(SyncUserRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;
        String uid = request.getFirebaseUid();

        User user = null;
        if (StringUtils.hasText(uid)) {
            user = userRepository.findByFirebaseUid(uid).orElse(null);
        }
        if (user == null && StringUtils.hasText(email)) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.STUDENT;

        if (user != null) {
            // Update existing user details
            if (StringUtils.hasText(uid)) {
                user.setFirebaseUid(uid);
            }
            if (StringUtils.hasText(request.getFullName())) {
                user.setFullName(request.getFullName().trim());
            }
            if (StringUtils.hasText(request.getPhoneNumber())) {
                user.setPhoneNumber(request.getPhoneNumber().trim());
            }
            if (StringUtils.hasText(request.getCollege())) {
                user.setCollege(request.getCollege());
            }
            if (StringUtils.hasText(request.getBranch())) {
                user.setBranch(request.getBranch());
            }
            if (StringUtils.hasText(request.getYear())) {
                user.setYear(request.getYear());
            }
            if (StringUtils.hasText(request.getEmergencyContact())) {
                user.setEmergencyContact(request.getEmergencyContact());
            }
            if (request.getApproved() != null) {
                user.setApproved(request.getApproved());
            }
            if (request.getBlocked() != null) {
                user.setBlocked(request.getBlocked());
            }
            User saved = userRepository.save(user);
            return UserResponse.fromUser(saved);
        }

        // Auto-create newly registered Firebase user in MySQL
        boolean isOrganizer = (assignedRole == Role.ORGANIZER);
        boolean isApproved = request.getApproved() != null ? request.getApproved() : !isOrganizer;

        User newUser = User.builder()
                .firebaseUid(uid)
                .email(email)
                .fullName(StringUtils.hasText(request.getFullName()) ? request.getFullName().trim() : (email != null ? email.split("@")[0] : "AVENTO User"))
                .phoneNumber(request.getPhoneNumber())
                .role(assignedRole)
                .college(request.getCollege())
                .branch(request.getBranch())
                .year(request.getYear())
                .emergencyContact(request.getEmergencyContact())
                .verified(true)
                .approved(isApproved)
                .blocked(false)
                .build();

        User savedUser = userRepository.save(newUser);

        // Send welcome email & audit log
        try {
            emailService.sendWelcomeEmail(savedUser);
            auditLogService.log("REGISTRATION", savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name(), null, "Firebase account synced as " + savedUser.getRole());
        } catch (Exception ex) {
            // Log warning without failing registration
        }

        return UserResponse.fromUser(savedUser);
    }

    @Override
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return UserResponse.fromUser(user);
    }

    @Override
    public MessageResponse logout() {
        return MessageResponse.ok("Logged out successfully");
    }

    @Override
    @Transactional
    public UserResponse approveOrganizer(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setApproved(true);
        User updated = userRepository.save(user);

        // Dispatch approval email
        try {
            emailService.sendOrganizerApprovalEmail(updated);
            auditLogService.log("APPROVAL", updated.getId(), updated.getEmail(), updated.getRole().name(), null, "Organizer account approved by Admin");
        } catch (Exception ex) {
            // Log warning without failing approval
        }

        return UserResponse.fromUser(updated);
    }

    @Override
    public List<UserResponse> getPendingOrganizers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ORGANIZER && !Boolean.TRUE.equals(u.getApproved()))
                .map(UserResponse::fromUser)
                .toList();
    }
}
