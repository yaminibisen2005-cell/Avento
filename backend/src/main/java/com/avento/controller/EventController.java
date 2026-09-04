package com.avento.controller;

import com.avento.dto.CreateEventRequest;
import com.avento.dto.EventDto;
import com.avento.entity.User;
import com.avento.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getExploreEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String priceTier,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String sort
    ) {
        List<EventDto> events = eventService.getFilteredEvents(category, query, mode, priceTier, college, sort);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        EventDto event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        EventDto created = eventService.createEvent(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Long id,
            @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        EventDto updated = eventService.updateEvent(id, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        eventService.deleteEvent(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
