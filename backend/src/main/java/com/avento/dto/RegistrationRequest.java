package com.avento.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String college;
    private String branch;
    private String year;
    private String gender;
    private String emergencyContact;
    private String teamName;
    private String specialRequirements;
    private String paymentMethod; // e.g. Free Tier, UPI / Razorpay
}
