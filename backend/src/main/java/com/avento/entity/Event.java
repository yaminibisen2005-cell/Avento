package com.avento.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 300)
    private String subtitle;

    @Column(nullable = false, length = 60)
    private String category; // Hackathons, Workshops, Conferences, Seminars, Competitions

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String mode = "In-Person"; // In-Person, Online, Hybrid

    @Column(length = 50)
    @Builder.Default
    private String difficulty = "All Levels";

    @Column(nullable = false, length = 200)
    private String venue;

    @Column(nullable = false, length = 60)
    private String date;

    @Column(length = 60)
    private String time;

    @Column(length = 60)
    private String registrationDeadline;

    @Column(length = 60)
    private String countdownTarget;

    @Column(length = 500)
    private String image;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String learningOutcomesJson;

    @Column(columnDefinition = "TEXT")
    private String whyAttendJson;

    @Column(columnDefinition = "TEXT")
    private String timelineJson;

    @Column(columnDefinition = "TEXT")
    private String speakersJson;

    @Column(nullable = false)
    @Builder.Default
    private Integer seatsTotal = 100;

    @Column(nullable = false)
    @Builder.Default
    private Integer seatsFilled = 0;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String fee = "Free";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PUBLISHED"; // PUBLISHED, PENDING, DRAFT, COMPLETED, CANCELLED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
