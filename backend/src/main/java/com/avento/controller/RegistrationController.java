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

    @GetMapping("/tickets/{id}")
    public ResponseEntity<TicketDto> getTicketDetails(@PathVariable Long id) {
        TicketDto ticket = registrationService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
}
