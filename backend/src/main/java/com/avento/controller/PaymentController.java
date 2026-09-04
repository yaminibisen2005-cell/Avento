package com.avento.controller;

import com.avento.dto.*;
import com.avento.entity.User;
import com.avento.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        CreateOrderResponse response = paymentService.createOrder(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<TicketDto> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        TicketDto ticket = paymentService.verifyPayment(request, currentUser);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentDto>> getPaymentHistory(
            @AuthenticationPrincipal User currentUser
    ) {
        List<PaymentDto> history = paymentService.getUserPaymentHistory(currentUser);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<PaymentDto> refundPayment(
            @PathVariable String paymentId,
            @AuthenticationPrincipal User currentUser
    ) {
        PaymentDto refunded = paymentService.refundPayment(paymentId, currentUser);
        return ResponseEntity.ok(refunded);
    }
}
