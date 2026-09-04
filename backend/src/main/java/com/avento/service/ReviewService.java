package com.avento.service;

import com.avento.dto.ReviewDto;
import com.avento.dto.ReviewReplyRequest;
import com.avento.dto.ReviewRequest;
import com.avento.entity.User;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    Map<String, Object> getEventReviewsWithStats(Long eventId);
    ReviewDto addReview(Long eventId, ReviewRequest req, User user);
    ReviewDto replyToReview(Long reviewId, ReviewReplyRequest req, User organizer);
    void reportReview(Long reviewId, User user);
}
