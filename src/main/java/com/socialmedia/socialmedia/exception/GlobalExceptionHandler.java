package com.socialmedia.socialmedia.exception;

import com.socialmedia.socialmedia.dto.AuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<AuthResponse> handleAuthException(AuthException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(new AuthResponse(ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponse(message, null));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<AuthResponse> handleDuplicate(DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new AuthResponse("Email already exists", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthResponse> handleGeneric(Exception ex) {
        log.error("Unhandled API error", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(ex.getMessage() != null ? ex.getMessage() : "Something went wrong. Please try again.", null));
    }
}
