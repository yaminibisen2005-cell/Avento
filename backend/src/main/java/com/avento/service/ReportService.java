package com.avento.service;

import com.avento.entity.User;

public interface ReportService {
    byte[] generateInvoicePdf(String txnId);
    byte[] generateAttendanceExcel(Long eventId);
    byte[] generateRevenueExcel(User organizer);
    byte[] generateEventsCsv();
}
