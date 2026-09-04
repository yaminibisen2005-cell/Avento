package com.avento.service;

import com.avento.entity.*;

import java.util.List;

public interface EmailService {
    void sendForgotPasswordOtp(String email, String otp);
    void sendWelcomeEmail(User user);
    void sendRegistrationConfirmation(Registration registration, Event event);
    void sendTicketEmail(Ticket ticket, Event event, User user);
    void sendCertificateEmail(Certificate certificate, Event event, User user);
    void sendOrganizerApprovalEmail(User organizer);
    void sendPaymentReceiptEmail(Payment payment, Event event, User user);
    void sendRefundConfirmationEmail(Payment payment, Event event, User user);
    void sendAdminAnnouncementEmail(Announcement announcement, List<User> recipients);
}
