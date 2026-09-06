package com.avento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceScanResponse {
    private boolean valid;
    private String message;
    private String studentName;
    private String studentEmail;
    private String college;
    private String registrationNumber;
    private Long eventId;
    private String eventTitle;
    private String ticketId;
    private String seatNumber;
    private String checkInTime;
    private boolean alreadyCheckedIn;
}
