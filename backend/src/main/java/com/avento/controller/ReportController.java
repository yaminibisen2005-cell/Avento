package com.avento.controller;

import com.avento.entity.User;
import com.avento.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/invoices/{txnId}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable String txnId) {
        byte[] pdf = reportService.generateInvoicePdf(txnId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Invoice-" + txnId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/attendance/{eventId}/excel")
    public ResponseEntity<byte[]> downloadAttendanceExcel(@PathVariable Long eventId) {
        byte[] excel = reportService.generateAttendanceExcel(eventId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Attendance-Roster-Event-" + eventId + ".xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/revenue/excel")
    public ResponseEntity<byte[]> downloadRevenueExcel(@AuthenticationPrincipal User organizer) {
        byte[] excel = reportService.generateRevenueExcel(organizer);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Revenue-Settlement-Report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/events/csv")
    public ResponseEntity<byte[]> downloadEventsCsv() {
        byte[] csv = reportService.generateEventsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=AVENTO-Events-Export.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
