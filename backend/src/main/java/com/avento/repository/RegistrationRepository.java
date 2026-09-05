package com.avento.repository;

import com.avento.entity.Event;
import com.avento.entity.Registration;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUserOrderByRegisteredAtDesc(User user);

    List<Registration> findByEventOrderByRegisteredAtDesc(Event event);
    List<Registration> findByEventInOrderByRegisteredAtDesc(List<Event> events);

    Optional<Registration> findByRegistrationNumber(String registrationNumber);

    boolean existsByEventAndUser(Event event, User user);
    boolean existsByUserAndEvent(User user, Event event);

    long countByEvent(Event event);

    long countByEventAndAttendedTrue(Event event);
}
