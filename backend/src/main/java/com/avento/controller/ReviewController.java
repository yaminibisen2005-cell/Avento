package com.avento.controller;

import com.avento.dto.MessageResponse;
import com.avento.dto.ReviewDto;
import com.avento.dto.ReviewReplyRequest;
import com.avento.dto.ReviewRequest;
import com.avento.entity.User;
import com.avento.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/events/{eventId}/reviews")
    public ResponseEntity<Map<String, Object>> getEventReviews(@PathVariable Long eventId) {
        return ResponseEntity.ok(reviewService.getEventReviewsWithStats(eventId));
    }

    @PostMapping("/events/{eventId}/reviews")
    public ResponseEntity<ReviewDto> addReview(
            @PathVariable Long eventId,
            @Valid @RequestBody ReviewRequest req,
            @AuthenticationPrincipal User user
    ) {
        ReviewDto created = reviewService.addReview(eventId, req, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/reviews/{reviewId}/reply")
    public ResponseEntity<ReviewDto> replyToReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewReplyRequest req,
            @AuthenticationPrincipal User user
    ) {
        ReviewDto updated = reviewService.replyToReview(reviewId, req, user);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/reviews/{reviewId}/report")
    public ResponseEntity<MessageResponse> reportReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal User user
    ) {
        reviewService.reportReview(reviewId, user);
        return ResponseEntity.ok(MessageResponse.ok("Review reported for administrative review"));
    }
}
