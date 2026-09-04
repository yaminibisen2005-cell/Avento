package com.avento.repository;

import com.avento.entity.Payment;
import com.avento.entity.PaymentStatus;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findAllByOrderByCreatedAtDesc();

    List<Payment> findByUserOrderByCreatedAtDesc(User user);

    Optional<Payment> findByTxnId(String txnId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);

    long countByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.event.organizer = :organizer ORDER BY p.createdAt DESC")
    List<Payment> findByOrganizerOrderByCreatedAtDesc(@Param("organizer") User organizer);

    @Query("SELECT COALESCE(SUM(p.amountInPaise), 0) FROM Payment p WHERE p.event.organizer = :organizer AND p.status = :status")
    Long sumAmountInPaiseByOrganizerAndStatus(@Param("organizer") User organizer, @Param("status") PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amountInPaise), 0) FROM Payment p WHERE p.status = :status")
    Long sumTotalAmountInPaiseByStatus(@Param("status") PaymentStatus status);
}
