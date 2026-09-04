package com.avento.service;

import com.avento.dto.*;
import com.avento.entity.User;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    CreateOrderResponse createOrder(CreateOrderRequest request, User user);

    TicketDto verifyPayment(VerifyPaymentRequest request, User user);

    List<PaymentDto> getUserPaymentHistory(User user);

    List<PaymentDto> getAllPayments();

    PaymentDto refundPayment(String txnOrPaymentId, User admin);

    Map<String, Object> getOrganizerRevenue(User organizer);
}
