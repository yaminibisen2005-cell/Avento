package com.avento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    private Long eventId;

    @NotBlank(message = "Message cannot be blank")
    private String message;
}
