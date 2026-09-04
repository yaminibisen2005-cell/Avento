package com.avento.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String certificateNumber; // e.g. CERT-AVT-99201

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String recipientName;

    @Column(nullable = false, length = 60)
    private String issueDate;

    @Column(length = 100)
    private String score; // e.g. Top 5 Finalist, 1st Runner Up, 100% Attendance Verified

    @Column(length = 100)
    private String grade; // e.g. Certificate of Excellence, Certificate of Merit

    @Column(length = 300)
    private String verifyUrl;

    @Column(nullable = false, length = 100)
    private String securityHash; // SHA-256 hash

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, REVOKED

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime issuedAt;
}
