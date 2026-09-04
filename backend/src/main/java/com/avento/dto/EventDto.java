package com.avento.dto;

import com.avento.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {
    private Long id;
    private String title;
    private String subtitle;
    private String category;
    private String mode;
    private String difficulty;
    private String venue;
    private String date;
    private String time;
    private String registrationDeadline;
    private String countdownTarget;
    private String image;
    private String shortDescription;
    private String description;
    private String learningOutcomesJson;
    private String whyAttendJson;
    private String timelineJson;
    private String speakersJson;
    private Integer seatsTotal;
    private Integer seatsFilled;
    private Integer seatsLeft;
    private String fee;
    private String status;
    private Long organizerId;
    private String organizerName;

    public static EventDto fromEntity(Event event) {
        if (event == null) return null;
        int total = event.getSeatsTotal() != null ? event.getSeatsTotal() : 100;
        int filled = event.getSeatsFilled() != null ? event.getSeatsFilled() : 0;
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .subtitle(event.getSubtitle())
                .category(event.getCategory())
                .mode(event.getMode())
                .difficulty(event.getDifficulty())
                .venue(event.getVenue())
                .date(event.getDate())
                .time(event.getTime())
                .registrationDeadline(event.getRegistrationDeadline())
                .countdownTarget(event.getCountdownTarget())
                .image(event.getImage())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .learningOutcomesJson(event.getLearningOutcomesJson())
                .whyAttendJson(event.getWhyAttendJson())
                .timelineJson(event.getTimelineJson())
                .speakersJson(event.getSpeakersJson())
                .seatsTotal(total)
                .seatsFilled(filled)
                .seatsLeft(Math.max(0, total - filled))
                .fee(event.getFee())
                .status(event.getStatus())
                .organizerId(event.getOrganizer() != null ? event.getOrganizer().getId() : null)
                .organizerName(event.getOrganizer() != null ? event.getOrganizer().getFullName() : "AVENTO Technical Council")
                .build();
    }
}
