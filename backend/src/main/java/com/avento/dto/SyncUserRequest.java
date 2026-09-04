package com.avento.dto;

import com.avento.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncUserRequest {
    private String firebaseUid;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private String college;
    private String branch;
    private String year;
    private String emergencyContact;
    private Boolean approved;
    private Boolean blocked;
}
