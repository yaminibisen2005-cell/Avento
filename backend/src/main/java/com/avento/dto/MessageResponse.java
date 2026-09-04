package com.avento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private boolean success;
    private String message;
    private Object data;

    public static MessageResponse ok(String message) {
        return MessageResponse.builder().success(true).message(message).build();
    }

    public static MessageResponse ok(String message, Object data) {
        return MessageResponse.builder().success(true).message(message).data(data).build();
    }

    public static MessageResponse error(String message) {
        return MessageResponse.builder().success(false).message(message).build();
    }
}
