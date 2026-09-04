package com.avento.dto;

import com.avento.entity.Ticket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketDto {
    private Long id;
    private String ticketId;
    private String registrationId;
    private Long eventId;
    private String eventTitle;
    private String category;
    private String date;
    private String time;
    private String venue;
    private String mode;
    private String organizer;
    private String studentName;
    private String studentEmail;
    private String studentPhoto;
    private String seatNumber;
    private String status;
    private String qrCode;

    public static TicketDto fromEntity(Ticket t) {
        if (t == null) return null;
        String eventTitle = t.getEvent() != null ? t.getEvent().getTitle() : "Event";
        String category = t.getEvent() != null ? t.getEvent().getCategory() : "Technology";
        String date = t.getEvent() != null ? t.getEvent().getDate() : "";
        String time = t.getEvent() != null ? t.getEvent().getTime() : "09:00 AM IST";
        String venue = t.getEvent() != null ? t.getEvent().getVenue() : "";
        String mode = t.getEvent() != null ? t.getEvent().getMode() : "In-Person";
        String orgName = t.getEvent() != null && t.getEvent().getOrganizer() != null ?
                t.getEvent().getOrganizer().getFullName() : "AVENTO Technical Council";
        String studentName = t.getRegistration() != null ? t.getRegistration().getStudentName() :
                (t.getUser() != null ? t.getUser().getFullName() : "Attendee");
        String studentEmail = t.getRegistration() != null ? t.getRegistration().getStudentEmail() :
                (t.getUser() != null ? t.getUser().getEmail() : "");
        String studentPhoto = t.getUser() != null && t.getUser().getProfileImage() != null ?
                t.getUser().getProfileImage() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

        return TicketDto.builder()
                .id(t.getId())
                .ticketId(t.getTicketNumber())
                .registrationId(t.getRegistration() != null ? t.getRegistration().getRegistrationNumber() : "")
                .eventId(t.getEvent() != null ? t.getEvent().getId() : null)
                .eventTitle(eventTitle)
                .category(category)
                .date(date)
                .time(time)
                .venue(venue)
                .mode(mode)
                .organizer(orgName)
                .studentName(studentName)
                .studentEmail(studentEmail)
                .studentPhoto(studentPhoto)
                .seatNumber(t.getSeatNumber())
                .status(t.getStatus())
                .qrCode(t.getQrCodePayload())
                .build();
    }
}
