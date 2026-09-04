package com.avento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardResponse {
    private Map<String, Object> stats;
    private List<TicketDto> upcomingEvents;
    private List<EventDto> exploreEvents;
    private List<RegistrationResponse> registrations;
    private List<CertificateDto> certificates;
    private List<Map<String, Object>> notifications;
}
