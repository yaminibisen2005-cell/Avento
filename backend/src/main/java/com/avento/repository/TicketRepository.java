package com.avento.repository;

import com.avento.entity.Event;
import com.avento.entity.Registration;
import com.avento.entity.Ticket;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByUserOrderByIssuedAtDesc(User user);

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    Optional<Ticket> findByRegistration(Registration registration);

    Optional<Ticket> findByQrCodePayload(String qrCodePayload);

    long countByEvent(Event event);
}
