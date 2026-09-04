package com.avento.dto;

import com.avento.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long eventId;
    private String studentName;
    private String studentAvatar;
    private String college;
    private Integer rating;
    private String comment;
    private boolean verifiedAttendee;
    private String organizerReply;
    private String organizerRepliedAt;
    private String date;

    public static ReviewDto fromEntity(Review r) {
        if (r == null) return null;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        String dateStr = r.getCreatedAt() != null ? r.getCreatedAt().format(fmt) : "Recent";
        String replyDate = r.getOrganizerRepliedAt() != null ? r.getOrganizerRepliedAt().format(fmt) : null;

        return ReviewDto.builder()
                .id(r.getId())
                .eventId(r.getEvent().getId())
                .studentName(r.getStudentName())
                .studentAvatar(r.getStudentAvatar())
                .college(r.getCollege())
                .rating(r.getRating())
                .comment(r.getComment())
                .verifiedAttendee(r.isVerifiedAttendee())
                .organizerReply(r.getOrganizerReply())
                .organizerRepliedAt(replyDate)
                .date(dateStr)
                .build();
    }
}
