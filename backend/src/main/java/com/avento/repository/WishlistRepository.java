package com.avento.repository;

import com.avento.entity.Event;
import com.avento.entity.User;
import com.avento.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserOrderByCreatedAtDesc(User user);
    Optional<WishlistItem> findByUserAndEvent(User user, Event event);
    boolean existsByUserAndEvent(User user, Event event);
    void deleteByUserAndEvent(User user, Event event);
}
