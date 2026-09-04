package com.avento.repository;

import com.avento.entity.Event;
import com.avento.entity.Review;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEventOrderByCreatedAtDesc(Event event);
    Optional<Review> findByEventAndUser(Event event, User user);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.event = :event")
    Double getAverageRatingByEvent(@Param("event") Event event);

    long countByEvent(Event event);

    List<Review> findByReportedTrueOrderByCreatedAtDesc();
}
