package com.avento.controller;

import com.avento.dto.RegistrationRequest;
import com.avento.dto.RegistrationResponse;
import com.avento.dto.TicketDto;
import com.avento.entity.User;
import com.avento.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/registrations")
    public ResponseEntity<RegistrationResponse> registerEvent(
            @Valid @RequestBody RegistrationRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        RegistrationResponse response = registrationService.registerEvent(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/tickets/{identifier}")
    public ResponseEntity<TicketDto> getTicketDetails(@PathVariable String identifier) {
        TicketDto ticket;
        try {
            Long id = Long.parseLong(identifier);
            ticket = registrationService.getTicketById(id);
        } catch (NumberFormatException | com.avento.exception.ResourceNotFoundException e) {
            ticket = registrationService.getTicketByNumber(identifier);
        }
        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/registrations/check/{eventId}")
    public ResponseEntity<java.util.Map<String, Object>> checkRegistration(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User currentUser
    ) {
        boolean isRegistered = registrationService.isUserRegistered(eventId, currentUser);
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("eventId", eventId);
        resp.put("isRegistered", isRegistered);
        return ResponseEntity.ok(resp);
    }
}
