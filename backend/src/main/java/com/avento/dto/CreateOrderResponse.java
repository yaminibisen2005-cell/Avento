package com.avento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderResponse {
    private String orderId;
    private Long amountInPaise;
    private String formattedAmount;
    private String currency;
    private String keyId;
    private Long eventId;
    private String eventTitle;
    private String eventCategory;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private boolean isFree;
    private TicketDto ticket;
}
