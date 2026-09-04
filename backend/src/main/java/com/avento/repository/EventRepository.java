package com.avento.repository;

import com.avento.entity.Event;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(String status);

    List<Event> findByStatusOrderByCreatedAtDesc(String status);

    List<Event> findByOrganizerOrderByCreatedAtDesc(User organizer);

    List<Event> findByCategoryAndStatus(String category, String status);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Event> searchEvents(@Param("query") String query, @Param("status") String status);

    long countByStatus(String status);
}
