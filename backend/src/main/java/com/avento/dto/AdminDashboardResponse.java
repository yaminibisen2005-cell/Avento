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
public class AdminDashboardResponse {
    private Map<String, Object> kpis;
    private List<Map<String, Object>> recentActivity;
    private List<Map<String, Object>> latestRegistrations;
    private List<Map<String, Object>> latestOrganizers;
    private List<Map<String, Object>> latestPayments;
}
