package com.avento.service.impl;

import com.avento.dto.ReviewDto;
import com.avento.dto.ReviewReplyRequest;
import com.avento.dto.ReviewRequest;
import com.avento.entity.Event;
import com.avento.entity.Review;
import com.avento.entity.User;
import com.avento.exception.BadRequestException;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.EventRepository;
import com.avento.repository.RegistrationRepository;
import com.avento.repository.ReviewRepository;
import com.avento.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEventReviewsWithStats(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        List<Review> reviews = reviewRepository.findByEventOrderByCreatedAtDesc(event);
        Double avg = reviewRepository.getAverageRatingByEvent(event);
        double roundedAvg = avg != null ? Math.round(avg * 10.0) / 10.0 : 4.9;

        List<ReviewDto> dtos = reviews.stream().map(ReviewDto::fromEntity).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("reviews", dtos);
        result.put("totalReviews", reviews.size());
        result.put("averageRating", roundedAvg);
        return result;
    }

    @Override
    @Transactional
    public ReviewDto addReview(Long eventId, ReviewRequest req, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        boolean isRegistered = registrationRepository.existsByUserAndEvent(user, event);

        Review review = reviewRepository.findByEventAndUser(event, user)
                .orElseGet(() -> Review.builder()
                        .event(event)
                        .user(user)
                        .studentName(user.getFullName())
                        .studentAvatar(user.getProfileImage())
                        .college(user.getCollege() != null ? user.getCollege() : "University Attendee")
                        .build());

        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setVerifiedAttendee(isRegistered);

        Review saved = reviewRepository.save(review);
        return ReviewDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public ReviewDto replyToReview(Long reviewId, ReviewReplyRequest req, User organizer) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        review.setOrganizerReply(req.getReply());
        review.setOrganizerRepliedAt(LocalDateTime.now());
        Review saved = reviewRepository.save(review);
        return ReviewDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public void reportReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        review.setReported(true);
        reviewRepository.save(review);
    }
}
