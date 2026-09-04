package com.avento.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceScanRequest {

    @NotBlank(message = "QR Payload or Ticket ID is required")
    private String qrCode;

    private Long eventId;
}
