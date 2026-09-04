package com.avento.config;

import com.avento.entity.*;
import com.avento.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final TicketRepository ticketRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationRepository notificationRepository;
    private final PaymentRepository paymentRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("UPDATE payments SET status = 'SUCCESS' WHERE status IN ('Settled', 'settled')");
        } catch (Exception e) {
            logger.warn("Payments status migration skipped: {}", e.getMessage());
        }

        // 1. USERS
        String adminEmail = "admin@avento.com";
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .fullName("AVENTO Administrator")
                    .email(adminEmail)
                    .phoneNumber("9999999999")
                    .password(passwordEncoder.encode("Password@123"))
                    .role(Role.ADMIN)
                    .verified(true)
                    .approved(true)
                    .college("AVENTO HQ")
                    .build();
            admin = userRepository.save(admin);
            logger.info("Default ADMIN user initialized: {}", adminEmail);
        } else if (!Boolean.TRUE.equals(admin.getApproved()) || !Boolean.TRUE.equals(admin.getVerified())) {
            admin.setApproved(true);
            admin.setVerified(true);
            userRepository.save(admin);
        }

        String orgEmail = "organizer@avento.com";
        String orgPhone = "9123456780";
        User org = userRepository.findByEmail(orgEmail).orElse(null);
        if (org == null && !userRepository.existsByPhoneNumber(orgPhone)) {
            org = User.builder()
                    .fullName("IIT Delhi Tech Council")
                    .email(orgEmail)
                    .phoneNumber(orgPhone)
                    .password(passwordEncoder.encode("Password@123"))
                    .role(Role.ORGANIZER)
                    .verified(true)
                    .approved(true)
                    .college("IIT Delhi")
                    .build();
            org = userRepository.save(org);
            logger.info("Default approved ORGANIZER user initialized: {}", orgEmail);
        }

        String pendingOrgEmail = "pending_organizer@avento.com";
        String pendingOrgPhone = "9123456789";
        if (!userRepository.existsByEmail(pendingOrgEmail) && !userRepository.existsByPhoneNumber(pendingOrgPhone)) {
            User pendingOrg = User.builder()
                    .fullName("BITS Innovators Club")
                    .email(pendingOrgEmail)
                    .phoneNumber(pendingOrgPhone)
                    .password(passwordEncoder.encode("Password@123"))
                    .role(Role.ORGANIZER)
                    .verified(true)
                    .approved(false)
                    .college("BITS Pilani")
                    .build();
            userRepository.save(pendingOrg);
            logger.info("Default pending ORGANIZER user initialized: {}", pendingOrgEmail);
        }

        String studentEmail = "student@avento.com";
        String studentPhone = "9876543299";
        User student = userRepository.findByEmail(studentEmail).orElse(null);
        if (student == null && !userRepository.existsByPhoneNumber(studentPhone)) {
            student = User.builder()
                    .fullName("Aarav Sharma")
                    .email(studentEmail)
                    .phoneNumber(studentPhone)
                    .password(passwordEncoder.encode("Password@123"))
                    .role(Role.STUDENT)
                    .verified(true)
                    .approved(true)
                    .college("IIT Delhi")
                    .branch("Computer Science")
                    .year("3rd Year")
                    .emergencyContact("+91 9876500000")
                    .build();
            student = userRepository.save(student);
            logger.info("Default STUDENT user initialized: {}", studentEmail);
        }

        // 2. EVENTS
        if (eventRepository.count() == 0) {
            Event e1 = Event.builder()
                    .title("National AI Hackathon 2026")
                    .subtitle("Build the next generation of autonomous intelligent agents & LLM architectures")
                    .category("Hackathons")
                    .mode("In-Person")
                    .difficulty("Intermediate to Advanced")
                    .venue("Main Auditorium, IIT Delhi")
                    .date("Oct 14 - 16, 2026")
                    .time("09:00 AM - 06:00 PM IST")
                    .registrationDeadline("Oct 10, 2026")
                    .countdownTarget("2026-10-14T09:00:00")
                    .image("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80")
                    .shortDescription("Join 700+ elite engineers, researchers, and creators across India for a 48-hour continuous hackathon tackling real-world problems in generative AI.")
                    .description("The National AI Hackathon 2026 is India’s flagship academic innovation challenge hosted in partnership with premier engineering institutions and industry giants. Over two high-intensity days, teams will prototype production-grade AI solutions.")
                    .seatsTotal(700)
                    .seatsFilled(648)
                    .fee("Free")
                    .status("PUBLISHED")
                    .organizer(org)
                    .build();
            e1 = eventRepository.save(e1);

            Event e2 = Event.builder()
                    .title("Cloud Native & DevOps Masterclass")
                    .subtitle("Production Kubernetes, Terraform & Distributed Observability on AWS")
                    .category("Workshops")
                    .mode("In-Person")
                    .difficulty("Beginner to Intermediate")
                    .venue("ECE Seminar Hall, BITS Pilani")
                    .date("Nov 02 - 03, 2026")
                    .time("02:00 PM - 07:00 PM IST")
                    .registrationDeadline("Oct 28, 2026")
                    .countdownTarget("2026-11-02T14:00:00")
                    .image("https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80")
                    .shortDescription("Hands-on 2-day immersive workshop mastering Docker, multi-tenant Kubernetes clusters, Helm charts, and GitOps pipelines.")
                    .description("Learn enterprise DevOps workflows directly from Senior SREs and Principal Cloud Architects.")
                    .seatsTotal(150)
                    .seatsFilled(128)
                    .fee("₹499")
                    .status("PUBLISHED")
                    .organizer(org)
                    .build();
            e2 = eventRepository.save(e2);

            Event e3 = Event.builder()
                    .title("Global Tech Leaders Conference")
                    .subtitle("Bridging academic frontier research with venture capital and hyperscale engineering")
                    .category("Conferences")
                    .mode("Online")
                    .difficulty("All Levels")
                    .venue("Convention Centre, Bangalore")
                    .date("Dec 05, 2026")
                    .time("10:00 AM - 05:00 PM IST")
                    .registrationDeadline("Nov 30, 2026")
                    .countdownTarget("2026-12-05T10:00:00")
                    .image("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80")
                    .shortDescription("Connect with 1,500+ global technologists, Founders, and VCs discussing AGI architectures, quantum simulation, and chip design.")
                    .description("The Global Tech Leaders Conference brings together high-impact research papers and keynote debates.")
                    .seatsTotal(500)
                    .seatsFilled(418)
                    .fee("₹999")
                    .status("PUBLISHED")
                    .organizer(org)
                    .build();
            eventRepository.save(e3);

            Event e4 = Event.builder()
                    .title("Web3 & Smart Contract Sprint")
                    .subtitle("Build decentralized protocol interfaces and zero-knowledge rollup verifiers")
                    .category("Competitions")
                    .mode("Online")
                    .difficulty("Intermediate")
                    .venue("Virtual Innovation Sandbox")
                    .date("Jan 18, 2027")
                    .time("10:00 AM IST")
                    .registrationDeadline("Jan 12, 2027")
                    .image("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80")
                    .shortDescription("36-hour competitive smart contract development with EVM security audits.")
                    .seatsTotal(200)
                    .seatsFilled(165)
                    .fee("Free")
                    .status("PUBLISHED")
                    .organizer(org)
                    .build();
            eventRepository.save(e4);

            Event e5 = Event.builder()
                    .title("Autonomous Robotics & IoT Symposium")
                    .subtitle("ROS2, SLAM algorithms, and embedded computer vision on edge devices")
                    .category("Seminars")
                    .mode("In-Person")
                    .difficulty("Advanced")
                    .venue("Auditorium 2, IIT Bombay")
                    .date("Feb 10, 2027")
                    .time("09:30 AM IST")
                    .registrationDeadline("Feb 01, 2027")
                    .image("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80")
                    .shortDescription("Live hardware demos, quadcopter navigation, and autonomous ground vehicles.")
                    .seatsTotal(250)
                    .seatsFilled(210)
                    .fee("₹299")
                    .status("PUBLISHED")
                    .organizer(org)
                    .build();
            eventRepository.save(e5);

            Event e6 = Event.builder()
                    .title("Full Stack Generative AI Bootcamp")
                    .subtitle("End-to-end full stack deployment of RAG agents with Next.js & FastAPI")
                    .category("Webinars")
                    .mode("Online")
                    .difficulty("Beginner")
                    .venue("Live Streamed Interactive Studio")
                    .date("Feb 24, 2027")
                    .time("04:00 PM IST")
                    .registrationDeadline("Feb 20, 2027")
                    .image("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80")
                    .shortDescription("Step-by-step masterclass connecting vector databases, LangChain, and responsive modern UIs.")
                    .seatsTotal(400)
                    .seatsFilled(280)
                    .fee("Free")
                    .status("PUBLISHED")
                    .organizer(org)
                    .build();
        }

        // 3. REGISTRATIONS & TICKETS FOR STUDENT
        if (student != null) {
            Event e1 = eventRepository.findAll().stream().filter(e -> e.getTitle().contains("AI Hackathon")).findFirst().orElse(null);
            Event e2 = eventRepository.findAll().stream().filter(e -> e.getTitle().contains("Cloud Native")).findFirst().orElse(null);

            if (e1 != null && !registrationRepository.existsByEventAndUser(e1, student)) {
                Registration r1 = Registration.builder()
                        .registrationNumber("REG-" + (1000 + student.getId() * 10 + 1))
                        .event(e1)
                        .user(student)
                        .studentName(student.getFullName())
                        .studentEmail(student.getEmail())
                        .studentPhone(student.getPhoneNumber())
                        .college(student.getCollege())
                        .branch("Computer Science")
                        .year("3rd Year")
                        .gender("Male")
                        .emergencyContact("+91 9876500000")
                        .teamName("Team NeuralNexus")
                        .paymentStatus("Paid (₹0 Free Tier)")
                        .paymentAmount("Free")
                        .paymentTxnId("TXN-FREE-101")
                        .status("Upcoming")
                        .attended(false)
                        .build();
                r1 = registrationRepository.save(r1);

                Ticket t1 = Ticket.builder()
                        .ticketNumber("AVT-HACK-" + (8000 + student.getId()))
                        .registration(r1)
                        .event(e1)
                        .user(student)
                        .qrCodePayload("AVENTO:TICKET:" + e1.getId() + ":" + student.getFullName().replaceAll(" ", "_") + ":8492")
                        .seatNumber("GA-A14")
                        .status("Confirmed")
                        .build();
                ticketRepository.save(t1);

                if (!certificateRepository.existsByEventAndUser(e1, student)) {
                    Certificate c1 = Certificate.builder()
                            .certificateNumber("CERT-AVT-" + (99200 + student.getId()))
                            .event(e1)
                            .user(student)
                            .recipientName(student.getFullName())
                            .issueDate("Nov 12, 2025")
                            .score("Top 5 Finalist")
                            .grade("Certificate of Excellence")
                            .verifyUrl("https://avento.io/verify/CERT-AVT-99201")
                            .securityHash("SHA256-E84F19A2")
                            .status("ACTIVE")
                            .build();
                    certificateRepository.save(c1);
                }
            }

            if (e2 != null && !registrationRepository.existsByEventAndUser(e2, student)) {
                Registration r2 = Registration.builder()
                        .registrationNumber("REG-" + (1000 + student.getId() * 10 + 2))
                        .event(e2)
                        .user(student)
                        .studentName(student.getFullName())
                        .studentEmail(student.getEmail())
                        .studentPhone(student.getPhoneNumber())
                        .college(student.getCollege())
                        .branch("Computer Science")
                        .year("3rd Year")
                        .gender("Male")
                        .paymentStatus("Paid (₹499 Razorpay)")
                        .paymentAmount("₹499")
                        .paymentTxnId("TXN-9942")
                        .status("Upcoming")
                        .attended(false)
                        .build();
                r2 = registrationRepository.save(r2);

                Ticket t2 = Ticket.builder()
                        .ticketNumber("AVT-WRK-" + (3100 + student.getId()))
                        .registration(r2)
                        .event(e2)
                        .user(student)
                        .qrCodePayload("AVENTO:TICKET:" + e2.getId() + ":" + student.getFullName().replaceAll(" ", "_") + ":3109")
                        .seatNumber("GA-B08")
                        .status("Confirmed")
                        .build();
                ticketRepository.save(t2);

                if (!certificateRepository.existsByEventAndUser(e2, student)) {
                    Certificate c2 = Certificate.builder()
                            .certificateNumber("CERT-AVT-" + (88310 + student.getId()))
                            .event(e2)
                            .user(student)
                            .recipientName(student.getFullName())
                            .issueDate("Aug 22, 2026")
                            .score("1st Runner Up")
                            .grade("Certificate of Merit")
                            .verifyUrl("https://avento.io/verify/CERT-AVT-88314")
                            .securityHash("SHA256-7C38B01F")
                            .status("ACTIVE")
                            .build();
                    certificateRepository.save(c2);
                }
            }

            // 5. NOTIFICATIONS
                Notification n1 = Notification.builder()
                        .user(student)
                        .title("Registration Approved")
                        .message("Your entry ticket for National AI Hackathon 2026 has been generated with verified QR pass.")
                        .type("ticket")
                        .isRead(false)
                        .build();
                notificationRepository.save(n1);

                Notification n2 = Notification.builder()
                        .user(student)
                        .title("New Certificate Available")
                        .message("Your official credential for Cloud Native & DevOps Masterclass is ready to download.")
                        .type("certificate")
                        .isRead(false)
                        .build();
                notificationRepository.save(n2);

                // 6. PAYMENTS LEDGER
                if (paymentRepository.count() == 0) {
                    Payment p1 = Payment.builder()
                            .txnId("TXN-9941")
                            .user(student)
                            .event(e1)
                            .studentName("Sneha Patel")
                            .organizerName("IIT Delhi Tech Council")
                            .eventTitle("Global Tech Leaders Summit")
                            .amount("₹999")
                            .amountInPaise(99900L)
                            .gateway("Razorpay Standard Checkout")
                            .status(PaymentStatus.SUCCESS)
                            .build();
                    paymentRepository.save(p1);

                    Payment p2 = Payment.builder()
                            .txnId("TXN-9942")
                            .user(student)
                            .event(e2)
                            .studentName("Aarav Sharma")
                            .organizerName("IIT Delhi Tech Council")
                            .eventTitle("Cloud Native & DevOps Masterclass")
                            .amount("₹499")
                            .amountInPaise(49900L)
                            .gateway("Razorpay Standard Checkout")
                            .status(PaymentStatus.SUCCESS)
                            .build();
                    paymentRepository.save(p2);
                }
            }

        // 7. ANNOUNCEMENTS
        if (announcementRepository.count() == 0) {
            Announcement a1 = Announcement.builder()
                    .title("Turnstile Protocol v2.4 Upgrade")
                    .message("Optical QR scanners at entrance turnstiles now process tickets in under 0.28 seconds with offline laser redundancy.")
                    .audience("Everyone")
                    .sentBy(admin)
                    .build();
            announcementRepository.save(a1);

            Announcement a2 = Announcement.builder()
                    .title("Institutional Sponsorship Applications Open")
                    .message("Academic clubs can now apply for direct infrastructure subsidies up to ₹1,00,000 for technical symposiums.")
                    .audience("Organizers")
                    .sentBy(admin)
                    .build();
            announcementRepository.save(a2);

            logger.info("AVENTO complete database seeding successfully finished.");
        }
    }
}
