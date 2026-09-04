package com.avento.dto;

import com.avento.entity.Registration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationResponse {
    private Long id;
    private String registrationId; // REG-101
    private Long eventId;
    private String eventTitle;
    private String category;
    private String date;
    private String venue;
    private String status;
    private String paymentStatus;
    private String ticketId;
    private String registeredOn;

    public static RegistrationResponse fromEntity(Registration reg, String ticketId) {
        if (reg == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        String regDate = reg.getRegisteredAt() != null ? reg.getRegisteredAt().format(formatter) : "Recently";
        return RegistrationResponse.builder()
                .id(reg.getId())
                .registrationId(reg.getRegistrationNumber())
                .eventId(reg.getEvent() != null ? reg.getEvent().getId() : null)
                .eventTitle(reg.getEvent() != null ? reg.getEvent().getTitle() : "Event")
                .category(reg.getEvent() != null ? reg.getEvent().getCategory() : "General")
                .date(reg.getEvent() != null ? reg.getEvent().getDate() : "")
                .venue(reg.getEvent() != null ? reg.getEvent().getVenue() : "")
                .status(reg.getStatus())
                .paymentStatus(reg.getPaymentStatus())
                .ticketId(ticketId != null ? ticketId : "")
                .registeredOn(regDate)
                .build();
    }
}
