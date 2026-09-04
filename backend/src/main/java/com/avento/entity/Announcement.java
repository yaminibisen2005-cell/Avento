package com.avento.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String audience = "Everyone"; // Everyone, Students, Organizers, Admins

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sent_by_id")
    private User sentBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
