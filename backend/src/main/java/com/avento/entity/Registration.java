package com.avento.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String registrationNumber; // e.g. REG-101

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String studentName;

    @Column(nullable = false, length = 120)
    private String studentEmail;

    @Column(length = 25)
    private String studentPhone;

    @Column(length = 150)
    private String college;

    @Column(length = 100)
    private String branch;

    @Column(length = 20)
    private String year;

    @Column(length = 20)
    private String gender;

    @Column(length = 25)
    private String emergencyContact;

    @Column(length = 100)
    private String teamName;

    @Column(length = 300)
    private String specialRequirements;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String paymentStatus = "Paid (Free)"; // Paid (₹0 Free Tier), Paid (₹499 Razorpay), Refunded

    @Column(length = 50)
    private String paymentAmount;

    @Column(length = 100)
    private String paymentTxnId;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "Upcoming"; // Upcoming, Completed, Cancelled

    @Column(nullable = false)
    @Builder.Default
    private Boolean attended = false;

    private LocalDateTime attendedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime registeredAt;
}
