package com.avento.service;

import com.avento.dto.AttendanceScanRequest;
import com.avento.dto.AttendanceScanResponse;
import com.avento.dto.CertificateDto;
import com.avento.dto.OrganizerDashboardResponse;
import com.avento.entity.Notification;
import com.avento.entity.User;

import java.util.List;
import java.util.Map;

public interface OrganizerService {

    OrganizerDashboardResponse getOrganizerDashboard(User organizer);

    AttendanceScanResponse scanAttendance(AttendanceScanRequest request, User organizer);

    CertificateDto generateCertificate(Long eventId, Long userId, String grade, String score);

    Map<String, Object> getOrganizerRevenue(User organizer);

    List<Notification> getOrganizerNotifications(User organizer);
}
