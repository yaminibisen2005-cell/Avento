package com.avento.service.impl;

import com.avento.dto.GlobalSearchResult;
import com.avento.entity.*;
import com.avento.repository.*;
import com.avento.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final PaymentRepository paymentRepository;
    private final AnnouncementRepository announcementRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GlobalSearchResult> search(String query, String filterType) {
        List<GlobalSearchResult> results = new ArrayList<>();
        if (query == null || query.trim().length() < 2) {
            return results;
        }

        String q = query.trim().toLowerCase();
        boolean all = filterType == null || filterType.isBlank() || "ALL".equalsIgnoreCase(filterType);

        // 1. Search Events
        if (all || "EVENTS".equalsIgnoreCase(filterType)) {
            List<Event> events = eventRepository.findAll();
            for (Event e : events) {
                if (e.getTitle().toLowerCase().contains(q) ||
                    (e.getCategory() != null && e.getCategory().toLowerCase().contains(q)) ||
                    (e.getVenue() != null && e.getVenue().toLowerCase().contains(q))) {
                    results.add(GlobalSearchResult.builder()
                            .type("EVENT")
                            .id(e.getId())
                            .title(e.getTitle())
                            .subtitle(e.getCategory() + " • " + e.getDate() + " • " + e.getVenue())
                            .badge(e.getFee())
                            .link("/events/" + e.getId())
                            .build());
                }
            }
        }

        // 2. Search Organizers / Colleges
        if (all || "ORGANIZERS".equalsIgnoreCase(filterType)) {
            List<User> organizers = userRepository.findByRole(Role.ORGANIZER);
            for (User u : organizers) {
                if (u.getFullName().toLowerCase().contains(q) ||
                    (u.getCollege() != null && u.getCollege().toLowerCase().contains(q))) {
                    results.add(GlobalSearchResult.builder()
                            .type("ORGANIZER")
                            .id(u.getId())
                            .title(u.getFullName())
                            .subtitle(u.getCollege() != null ? u.getCollege() : "Institutional Council")
                            .badge("Verified Host")
                            .link("/organizers/" + u.getId())
                            .build());
                }
            }
        }

        // 3. Search Certificates
        if (all || "CERTIFICATES".equalsIgnoreCase(filterType)) {
            List<Certificate> certs = certificateRepository.findAll();
            for (Certificate c : certs) {
                if (c.getCertificateNumber().toLowerCase().contains(q) ||
                    c.getRecipientName().toLowerCase().contains(q)) {
                    results.add(GlobalSearchResult.builder()
                            .type("CERTIFICATE")
                            .id(c.getId())
                            .title("Certificate: " + c.getRecipientName())
                            .subtitle(c.getCertificateNumber() + " • Hash: " + (c.getSecurityHash() != null ? c.getSecurityHash().substring(0, 8) + "..." : "Verified"))
                            .badge("Valid")
                            .link("/certificates/" + c.getId())
                            .build());
                }
            }
        }

        // 4. Search Payments
        if (all || "PAYMENTS".equalsIgnoreCase(filterType)) {
            List<Payment> payments = paymentRepository.findAll();
            for (Payment p : payments) {
                if (p.getTxnId().toLowerCase().contains(q) ||
                    (p.getStudentName() != null && p.getStudentName().toLowerCase().contains(q)) ||
                    (p.getEventTitle() != null && p.getEventTitle().toLowerCase().contains(q))) {
                    results.add(GlobalSearchResult.builder()
                            .type("PAYMENT")
                            .id(p.getId())
                            .title(p.getTxnId() + " - " + p.getEventTitle())
                            .subtitle(p.getStudentName() + " • " + p.getAmount())
                            .badge(p.getStatus() != null ? p.getStatus().name() : "SUCCESS")
                            .link("/payments/" + p.getId())
                            .build());
                }
            }
        }

        // 5. Search Announcements
        if (all || "ANNOUNCEMENTS".equalsIgnoreCase(filterType)) {
            List<Announcement> announcements = announcementRepository.findAll();
            for (Announcement a : announcements) {
                if (a.getTitle().toLowerCase().contains(q) ||
                    (a.getMessage() != null && a.getMessage().toLowerCase().contains(q))) {
                    results.add(GlobalSearchResult.builder()
                            .type("ANNOUNCEMENT")
                            .id(a.getId())
                            .title(a.getTitle())
                            .subtitle(a.getAudience() + " • " + (a.getMessage().length() > 60 ? a.getMessage().substring(0, 60) + "..." : a.getMessage()))
                            .badge(a.getAudience())
                            .link("/announcements")
                            .build());
                }
            }
        }

        return results;
    }
}
