package com.avento.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @JsonSetter("eventId")
    public void setEventId(Object id) {
        if (id instanceof Number n) {
            this.eventId = n.longValue();
        } else if (id != null) {
            String str = id.toString().replaceAll("\\D+", "");
            this.eventId = str.isEmpty() ? 1L : Long.parseLong(str);
        }
    }

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
}
