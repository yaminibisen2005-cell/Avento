package com.avento.dto;

import com.avento.entity.Certificate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateDto {
    private Long id;
    private String certificateId;
    private String eventTitle;
    private String organizer;
    private String recipientName;
    private String issueDate;
    private String score;
    private String grade;
    private String verifyUrl;
    private String securityHash;
    private String status;

    public static CertificateDto fromEntity(Certificate c) {
        if (c == null) return null;
        String eventTitle = c.getEvent() != null ? c.getEvent().getTitle() : "Event";
        String orgName = c.getEvent() != null && c.getEvent().getOrganizer() != null ?
                c.getEvent().getOrganizer().getFullName() : "AVENTO Technical Council";

        return CertificateDto.builder()
                .id(c.getId())
                .certificateId(c.getCertificateNumber())
                .eventTitle(eventTitle)
                .organizer(orgName)
                .recipientName(c.getRecipientName())
                .issueDate(c.getIssueDate())
                .score(c.getScore())
                .grade(c.getGrade())
                .verifyUrl(c.getVerifyUrl())
                .securityHash(c.getSecurityHash())
                .status(c.getStatus())
                .build();
    }
}
