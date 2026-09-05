package com.avento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String fullName;
    private String phoneNumber;
    private String college;
    private String branch;
    private String year;
    private String rollNumber;
    private String emergencyContact;
    private String profileImage;
    private String bio;
    private String gender;
    private String dob;
    private String city;
    private String state;
    private String linkedin;
    private String github;
    private String skills;
}
