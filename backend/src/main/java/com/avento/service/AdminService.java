package com.avento.service;

import com.avento.dto.*;
import com.avento.entity.Announcement;
import com.avento.entity.Payment;
import com.avento.entity.User;

import java.util.List;

public interface AdminService {

    AdminDashboardResponse getAdminDashboard();

    List<UserResponse> getAllUsers();

    UserResponse toggleBlockUser(Long id);

    void deleteUser(Long id);

    UserResponse approveOrganizer(Long id);

    void rejectOrganizer(Long id);

    List<Payment> getPayments();

    Payment refundPayment(String txnId);

    Announcement createAnnouncement(AnnouncementRequest req, User admin);

    List<Announcement> getAnnouncements();

    byte[] generateReport(String format, String timeframe);
}
