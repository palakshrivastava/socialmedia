package com.socialmedia.socialmedia.auth.repository;

import com.socialmedia.socialmedia.auth.entity.AuthAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthAccountRepository extends JpaRepository<AuthAccount, Long> {

    Optional<AuthAccount> findByEmail(String email);

    boolean existsByEmail(String email);
}
