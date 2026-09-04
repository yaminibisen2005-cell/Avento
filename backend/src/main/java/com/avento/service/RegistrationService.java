package com.avento.service;

import com.avento.dto.RegistrationRequest;
import com.avento.dto.RegistrationResponse;
import com.avento.dto.TicketDto;
import com.avento.entity.User;

import java.util.List;

public interface RegistrationService {

    RegistrationResponse registerEvent(RegistrationRequest request, User user);

    List<RegistrationResponse> getStudentRegistrations(User user);

    List<RegistrationResponse> getEventRegistrations(Long eventId, User organizer);

    List<TicketDto> getStudentTickets(User user);

    TicketDto getTicketById(Long id);

    TicketDto getTicketByNumber(String ticketNumber);
}
