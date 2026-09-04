package com.avento.repository;

import com.avento.entity.Certificate;
import com.avento.entity.Event;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUserOrderByIssuedAtDesc(User user);

    List<Certificate> findByEventOrderByIssuedAtDesc(Event event);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    Optional<Certificate> findBySecurityHash(String securityHash);

    boolean existsByEventAndUser(Event event, User user);

    long countByStatus(String status);
}
