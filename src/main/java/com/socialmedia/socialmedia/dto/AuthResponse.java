package com.socialmedia.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String token;
    private UserDto user;

    public AuthResponse(String message, String token) {
        this(message, token, null);
    }
}
