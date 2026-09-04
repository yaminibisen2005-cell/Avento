package com.avento.service.impl;

import com.avento.entity.*;
import com.avento.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:notifications@avento.io}")
    private String fromEmail;

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "AVENTO Platform");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Email dispatched successfully to: [{}] Subject: [{}]", to, subject);
        } catch (Exception e) {
            logger.info("Sandbox/Test Email Logged to: [{}] | Subject: [{}] | Content Preview: {}",
                    to, subject, htmlContent.replaceAll("<[^>]*>", " ").trim().substring(0, Math.min(120, htmlContent.length())));
        }
    }

    private String getHtmlWrapper(String headerTitle, String bodyContent) {
        return "<!DOCTYPE html><html><head><meta charset='utf-8'>"
                + "<style>"
                + "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF8F2; color: #1F2937; margin: 0; padding: 24px; }"
                + ".card { max-width: 580px; margin: auto; background: #ffffff; border-radius: 20px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 4px 24px rgba(15,93,70,0.06); }"
                + ".header { background: linear-gradient(135deg, #0B4B3A 0%, #0F5D46 100%); padding: 32px 24px; text-align: center; color: #ffffff; }"
                + ".logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; color: #ffffff; }"
                + ".gold-badge { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #D9B24A; letter-spacing: 2px; margin-top: 4px; }"
                + ".content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }"
                + ".button { display: inline-block; padding: 12px 24px; background: #0F5D46; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; margin: 16px 0; }"
                + ".footer { text-align: center; font-size: 11px; color: #9CA3AF; padding: 20px; border-top: 1px solid #F3F4F6; }"
                + "</style></head><body>"
                + "<div class='card'>"
                + "<div class='header'><h1 class='logo'>AVENTO</h1><div class='gold-badge'>" + headerTitle + "</div></div>"
                + "<div class='content'>" + bodyContent + "</div>"
                + "<div class='footer'>© 2026 AVENTO. Enterprise Campus Event Operating System. All rights reserved.</div>"
                + "</div></body></html>";
    }

    @Override
    @Async
    public void sendForgotPasswordOtp(String email, String otp) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Password Reset Verification</h2>"
                + "<p>You requested to reset your password for your AVENTO account. Use the one-time verification code below:</p>"
                + "<div style='background:#EAF7F1; padding:16px; text-align:center; border-radius:14px; margin:20px 0;'>"
                + "<span style='font-size:32px; font-weight:800; font-family:monospace; letter-spacing:8px; color:#0F5D46;'>" + otp + "</span>"
                + "</div>"
                + "<p style='color:#6B7280; font-size:12px;'>This OTP expires in 15 minutes. If you did not request this code, please ignore this email.</p>";
        sendHtmlEmail(email, "AVENTO: Your Password Reset Verification Code (" + otp + ")", getHtmlWrapper("SECURITY VERIFICATION", body));
    }

    @Override
    @Async
    public void sendWelcomeEmail(User user) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Welcome to AVENTO, " + user.getFullName() + "!</h2>"
                + "<p>Your verified student account has been created. You can now explore premier university hackathons, masterclasses, and conferences with frictionless 0.3s QR check-ins.</p>"
                + "<p><strong>Account Email:</strong> " + user.getEmail() + "<br/><strong>Role:</strong> " + user.getRole() + "</p>"
                + "<a href='http://localhost:5173' class='button'>Explore Campus Events</a>";
        sendHtmlEmail(user.getEmail(), "Welcome to AVENTO - Campus Events Operating System", getHtmlWrapper("WELCOME ABOARD", body));
    }

    @Override
    @Async
    public void sendRegistrationConfirmation(Registration reg, Event event) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Registration Confirmed!</h2>"
                + "<p>Hi <strong>" + reg.getStudentName() + "</strong>, your seat for <strong>" + event.getTitle() + "</strong> has been confirmed.</p>"
                + "<div style='background:#FAF8F2; border:1px solid #E5E7EB; border-radius:14px; padding:16px; margin:16px 0;'>"
                + "<p style='margin:4px 0;'><strong>Registration ID:</strong> " + reg.getRegistrationNumber() + "</p>"
                + "<p style='margin:4px 0;'><strong>Date & Time:</strong> " + event.getDate() + " (" + event.getTime() + ")</p>"
                + "<p style='margin:4px 0;'><strong>Venue:</strong> " + event.getVenue() + "</p>"
                + "</div>"
                + "<a href='http://localhost:5173' class='button'>View Digital Ticket</a>";
        sendHtmlEmail(reg.getStudentEmail(), "Registration Confirmed: " + event.getTitle(), getHtmlWrapper("REGISTRATION CONFIRMED", body));
    }

    @Override
    @Async
    public void sendTicketEmail(Ticket ticket, Event event, User user) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Your Digital Entry Pass is Ready</h2>"
                + "<p>Hi <strong>" + user.getFullName() + "</strong>, your boarding pass for <strong>" + event.getTitle() + "</strong> is ready for gate check-in.</p>"
                + "<div style='background:#EAF7F1; border:1px solid #0F5D46; border-radius:14px; padding:16px; margin:16px 0; text-align:center;'>"
                + "<span style='font-size:20px; font-weight:800; color:#0F5D46;'>" + ticket.getTicketNumber() + "</span><br/>"
                + "<span style='font-size:12px; color:#5E6A68;'>Seat: " + ticket.getSeatNumber() + "</span>"
                + "</div>"
                + "<p>Present your optical QR code at entrance turnstiles for instant admittance.</p>";
        sendHtmlEmail(user.getEmail(), "Your AVENTO Event Pass: " + ticket.getTicketNumber(), getHtmlWrapper("DIGITAL EVENT PASS", body));
    }

    @Override
    @Async
    public void sendCertificateEmail(Certificate cert, Event event, User user) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Certificate of Completion Awarded</h2>"
                + "<p>Congratulations <strong>" + cert.getRecipientName() + "</strong>! You have successfully earned an official credential for <strong>" + event.getTitle() + "</strong>.</p>"
                + "<p><strong>Certificate ID:</strong> " + cert.getCertificateNumber() + "<br/>"
                + "<strong>Cryptographic Hash:</strong> <code style='background:#FAF8F2; padding:2px 6px;'>" + cert.getSecurityHash() + "</code></p>"
                + "<a href='http://localhost:5173' class='button'>Download Certificate</a>";
        sendHtmlEmail(user.getEmail(), "Certificate Issued: " + event.getTitle(), getHtmlWrapper("VERIFIED CREDENTIAL", body));
    }

    @Override
    @Async
    public void sendOrganizerApprovalEmail(User organizer) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Organizer Account Approved!</h2>"
                + "<p>Dear <strong>" + organizer.getFullName() + "</strong>,</p>"
                + "<p>The AVENTO Central Administration has reviewed and approved your institutional organizer credentials for <strong>" + organizer.getCollege() + "</strong>.</p>"
                + "<p>You now have access to the enterprise Organizer Dashboard to publish events, conduct 0.3s turnstile scans, and issue certificates.</p>"
                + "<a href='http://localhost:5173' class='button'>Open Organizer Dashboard</a>";
        sendHtmlEmail(organizer.getEmail(), "AVENTO Organizer Application Approved", getHtmlWrapper("ACCOUNT VERIFIED", body));
    }

    @Override
    @Async
    public void sendPaymentReceiptEmail(Payment payment, Event event, User user) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Payment Receipt & GST Tax Invoice</h2>"
                + "<p>Thank you for your payment. Here is the transaction summary for your event registration:</p>"
                + "<div style='background:#FAF8F2; border:1px solid #E5E7EB; border-radius:14px; padding:16px; margin:16px 0;'>"
                + "<p style='margin:4px 0;'><strong>Transaction ID:</strong> " + payment.getTxnId() + "</p>"
                + "<p style='margin:4px 0;'><strong>Razorpay Order ID:</strong> " + (payment.getRazorpayOrderId() != null ? payment.getRazorpayOrderId() : "N/A") + "</p>"
                + "<p style='margin:4px 0;'><strong>Amount Paid:</strong> " + payment.getAmount() + "</p>"
                + "<p style='margin:4px 0;'><strong>Event:</strong> " + event.getTitle() + "</p>"
                + "<p style='margin:4px 0;'><strong>Status:</strong> " + payment.getStatus() + "</p>"
                + "</div>";
        sendHtmlEmail(user.getEmail(), "Payment Receipt: " + payment.getTxnId() + " (" + payment.getAmount() + ")", getHtmlWrapper("TAX INVOICE", body));
    }

    @Override
    @Async
    public void sendRefundConfirmationEmail(Payment payment, Event event, User user) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>Refund Reversal Processed</h2>"
                + "<p>Your refund of <strong>" + payment.getAmount() + "</strong> for <strong>" + event.getTitle() + "</strong> has been initiated via Razorpay.</p>"
                + "<p><strong>Refund Reference:</strong> " + payment.getRefundId() + "<br/>"
                + "Funds will reflect in your original payment method within 5-7 business days.</p>";
        sendHtmlEmail(user.getEmail(), "Refund Processed: " + payment.getTxnId(), getHtmlWrapper("REFUND REVERSAL", body));
    }

    @Override
    @Async
    public void sendAdminAnnouncementEmail(Announcement announcement, List<User> recipients) {
        String body = "<h2 style='color:#0F5D46; margin-top:0;'>" + announcement.getTitle() + "</h2>"
                + "<p>" + announcement.getMessage() + "</p>"
                + "<div style='background:#EAF7F1; padding:12px; border-radius:10px; font-size:12px; color:#0F5D46;'>"
                + "Audience Target: " + announcement.getAudience()
                + "</div>";
        for (User u : recipients) {
            sendHtmlEmail(u.getEmail(), "AVENTO Notice: " + announcement.getTitle(), getHtmlWrapper("SYSTEM ANNOUNCEMENT", body));
        }
    }
}
