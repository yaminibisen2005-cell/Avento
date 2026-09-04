package com.avento.dto;

import com.avento.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Long id;
    private String txnId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String studentName;
    private String studentEmail;
    private String eventTitle;
    private String organizerName;
    private String amount;
    private Long amountInPaise;
    private String currency;
    private String status;
    private String gateway;
    private String ticketNumber;
    private String registrationNumber;
    private String date;
    private String refundId;

    public static PaymentDto fromEntity(Payment p) {
        if (p == null) return null;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        String date = p.getCreatedAt() != null ? p.getCreatedAt().format(fmt) : "Recent";
        String ticketNum = p.getTicket() != null ? p.getTicket().getTicketNumber() : "";
        String regNum = p.getRegistration() != null ? p.getRegistration().getRegistrationNumber() : "";

        return PaymentDto.builder()
                .id(p.getId())
                .txnId(p.getTxnId())
                .razorpayOrderId(p.getRazorpayOrderId())
                .razorpayPaymentId(p.getRazorpayPaymentId())
                .studentName(p.getStudentName())
                .studentEmail(p.getUser() != null ? p.getUser().getEmail() : "")
                .eventTitle(p.getEventTitle())
                .organizerName(p.getOrganizerName())
                .amount(p.getAmount())
                .amountInPaise(p.getAmountInPaise())
                .currency(p.getCurrency() != null ? p.getCurrency() : "INR")
                .status(p.getStatus() != null ? p.getStatus().name() : "SUCCESS")
                .gateway(p.getGateway())
                .ticketNumber(ticketNum)
                .registrationNumber(regNum)
                .date(date)
                .refundId(p.getRefundId())
                .build();
    }
}
