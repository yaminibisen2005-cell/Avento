package com.avento.dto;

import com.avento.entity.Role;
import com.avento.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String firebaseUid;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String profileImage;
    private Boolean verified;
    private Boolean approved;
    private Boolean blocked;
    private String college;
    private String branch;
    private String year;
    private String rollNumber;
    private String emergencyContact;
    private String bio;
    private String gender;
    private String dob;
    private String city;
    private String state;
    private String linkedin;
    private String github;
    private String skills;
    private LocalDateTime createdAt;

    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firebaseUid(user.getFirebaseUid())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .verified(user.getVerified())
                .approved(user.getApproved())
                .blocked(user.getBlocked())
                .college(user.getCollege())
                .branch(user.getBranch())
                .year(user.getYear())
                .rollNumber(user.getRollNumber())
                .emergencyContact(user.getEmergencyContact())
                .bio(user.getBio())
                .gender(user.getGender())
                .dob(user.getDob())
                .city(user.getCity())
                .state(user.getState())
                .linkedin(user.getLinkedin())
                .github(user.getGithub())
                .skills(user.getSkills())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
