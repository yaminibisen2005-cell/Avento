package com.avento.service.impl;

import com.avento.entity.Event;
import com.avento.entity.Payment;
import com.avento.entity.Registration;
import com.avento.entity.User;
import com.avento.exception.ResourceNotFoundException;
import com.avento.repository.EventRepository;
import com.avento.repository.PaymentRepository;
import com.avento.repository.RegistrationRepository;
import com.avento.service.ReportService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] generateInvoicePdf(String txnId) {
        Payment p = paymentRepository.findByTxnId(txnId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for Txn: " + txnId));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryGreen = new Color(15, 93, 70);
            Color gold = new Color(217, 178, 74);
            Color lightGreen = new Color(234, 247, 241);

            // Fonts
            com.lowagie.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, primaryGreen);
            com.lowagie.text.Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, gold);
            com.lowagie.text.Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, primaryGreen);
            com.lowagie.text.Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            com.lowagie.text.Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

            // Header
            Paragraph title = new Paragraph("AVENTO", titleFont);
            Paragraph subtitle = new Paragraph("OFFICIAL GST TAX INVOICE & RECEIPT", subtitleFont);
            subtitle.setSpacingAfter(20);
            document.add(title);
            document.add(subtitle);

            // Metadata Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingAfter(20);

            metaTable.addCell(createCell("Invoice No: " + p.getTxnId(), boldFont, Color.WHITE));
            metaTable.addCell(createCell("Date: " + (p.getCreatedAt() != null ? p.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "Today"), bodyFont, Color.WHITE));
            metaTable.addCell(createCell("Billed To: " + (p.getStudentName() != null ? p.getStudentName() : "Student Attendee"), bodyFont, Color.WHITE));
            metaTable.addCell(createCell("Gateway: " + p.getGateway(), bodyFont, Color.WHITE));
            metaTable.addCell(createCell("Razorpay Order: " + (p.getRazorpayOrderId() != null ? p.getRazorpayOrderId() : "N/A"), bodyFont, Color.WHITE));
            metaTable.addCell(createCell("Status: " + p.getStatus(), boldFont, Color.WHITE));
            document.add(metaTable);

            // Items Table
            PdfPTable itemsTable = new PdfPTable(3);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{4, 2, 2});
            itemsTable.setSpacingAfter(25);

            itemsTable.addCell(createCell("Item & Event Description", boldFont, lightGreen));
            itemsTable.addCell(createCell("Category", boldFont, lightGreen));
            itemsTable.addCell(createCell("Amount (INR)", boldFont, lightGreen));

            itemsTable.addCell(createCell(p.getEventTitle() + "\nHost: " + p.getOrganizerName(), bodyFont, Color.WHITE));
            itemsTable.addCell(createCell(p.getEvent() != null ? p.getEvent().getCategory() : "Pass", bodyFont, Color.WHITE));
            itemsTable.addCell(createCell(p.getAmount(), boldFont, Color.WHITE));

            itemsTable.addCell(createCell("TOTAL SETTLED AMOUNT", boldFont, lightGreen));
            itemsTable.addCell(createCell("", bodyFont, lightGreen));
            itemsTable.addCell(createCell(p.getAmount(), boldFont, lightGreen));
            document.add(itemsTable);

            // Footer Notice
            Paragraph footer = new Paragraph("This is a computer-generated tax invoice verified by AVENTO Security Protocol v2.4.\nRazorpay Payments Node Verified • Tamper Proof Record.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF: " + e.getMessage(), e);
        }

        return out.toByteArray();
    }

    private PdfPCell createCell(String text, com.lowagie.text.Font font, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(8);
        cell.setBorderColor(new Color(229, 231, 235));
        return cell;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateAttendanceExcel(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        List<Registration> list = registrationRepository.findByEventOrderByRegisteredAtDesc(event);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Attendance Roster");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            // Title Row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("AVENTO Event Attendance Roster: " + event.getTitle());
            titleCell.setCellStyle(headerStyle);

            // Header Row
            Row headerRow = sheet.createRow(2);
            String[] columns = {"Reg ID", "Student Name", "Email", "College", "Branch", "Year", "Turnstile Attendance", "Check-in Timestamp"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data Rows
            int rowIdx = 3;
            for (Registration reg : list) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(reg.getRegistrationNumber());
                row.createCell(1).setCellValue(reg.getStudentName());
                row.createCell(2).setCellValue(reg.getStudentEmail());
                row.createCell(3).setCellValue(reg.getCollege() != null ? reg.getCollege() : "N/A");
                row.createCell(4).setCellValue(reg.getBranch() != null ? reg.getBranch() : "N/A");
                row.createCell(5).setCellValue(reg.getYear() != null ? reg.getYear() : "N/A");
                row.createCell(6).setCellValue(Boolean.TRUE.equals(reg.getAttended()) ? "Checked In (Admitted)" : "Pending Check-in");
                row.createCell(7).setCellValue(reg.getAttendedAt() != null ? reg.getAttendedAt().toString() : "-");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating attendance Excel: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateRevenueExcel(User organizer) {
        List<Payment> payments = paymentRepository.findByOrganizerOrderByCreatedAtDesc(organizer);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Revenue Ledger");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("AVENTO Financial Settlements Ledger - Organizer: " + organizer.getFullName());
            titleCell.setCellStyle(headerStyle);

            Row headerRow = sheet.createRow(2);
            String[] columns = {"Txn ID", "Razorpay Order ID", "Student Name", "Event Title", "Gross Amount", "Gateway", "Status", "Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 3;
            for (Payment p : payments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getTxnId());
                row.createCell(1).setCellValue(p.getRazorpayOrderId() != null ? p.getRazorpayOrderId() : "N/A");
                row.createCell(2).setCellValue(p.getStudentName());
                row.createCell(3).setCellValue(p.getEventTitle());
                row.createCell(4).setCellValue(p.getAmount());
                row.createCell(5).setCellValue(p.getGateway());
                row.createCell(6).setCellValue(p.getStatus() != null ? p.getStatus().name() : "SUCCESS");
                row.createCell(7).setCellValue(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "Recent");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating revenue Excel: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateEventsCsv() {
        List<Event> events = eventRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out)) {
            writer.println("ID,Title,Category,Date,Venue,Mode,Fee,SeatsTotal,SeatsFilled,Status");
            for (Event e : events) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%d,%d,\"%s\"%n",
                        e.getId(),
                        e.getTitle().replace("\"", "\"\""),
                        e.getCategory(),
                        e.getDate(),
                        e.getVenue(),
                        e.getMode(),
                        e.getFee(),
                        e.getSeatsTotal() != null ? e.getSeatsTotal() : 100,
                        e.getSeatsFilled() != null ? e.getSeatsFilled() : 0,
                        e.getStatus());
            }
            writer.flush();
            return out.toByteArray();
        }
    }
}
