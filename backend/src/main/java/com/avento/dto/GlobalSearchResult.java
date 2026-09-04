package com.avento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalSearchResult {
    private String type; // EVENT, ORGANIZER, STUDENT, CERTIFICATE, PAYMENT, ANNOUNCEMENT
    private Long id;
    private String title;
    private String subtitle;
    private String badge;
    private String link;
}
