package com.socialmedia.socialmedia.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

/**
 * PostgreSQL — credentials only (auth).
 * Profile data lives in MongoDB {@code users} collection, linked by {@code userId == id}.
 */
@Entity
@Table(name = "auth_accounts")
@Data
public class AuthAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
