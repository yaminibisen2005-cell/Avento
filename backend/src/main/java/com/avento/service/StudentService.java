package com.avento.service;

import com.avento.dto.CertificateDto;
import com.avento.dto.StudentDashboardResponse;
import com.avento.dto.UpdateProfileRequest;
import com.avento.entity.Notification;
import com.avento.entity.User;

import java.util.List;

public interface StudentService {

    StudentDashboardResponse getStudentDashboard(User user);

    List<CertificateDto> getStudentCertificates(User user);

    List<Notification> getStudentNotifications(User user);

    User updateStudentProfile(User user, UpdateProfileRequest request);
}
