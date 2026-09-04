package com.avento.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String studentName;

    @Column(length = 255)
    private String studentAvatar;

    @Column(length = 100)
    private String college;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    @Builder.Default
    private boolean verifiedAttendee = false;

    @Column(columnDefinition = "TEXT")
    private String organizerReply;

    private LocalDateTime organizerRepliedAt;

    @Builder.Default
    private boolean reported = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
