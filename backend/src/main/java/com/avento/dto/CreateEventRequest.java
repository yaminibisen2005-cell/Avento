package com.avento.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String subtitle;

    @NotBlank(message = "Category is required")
    private String category;

    private String mode;
    private String difficulty;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotBlank(message = "Date is required")
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
    private String fee;
    private String status;
}
