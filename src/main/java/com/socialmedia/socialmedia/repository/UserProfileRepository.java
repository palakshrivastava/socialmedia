package com.socialmedia.socialmedia.repository;

import com.socialmedia.socialmedia.document.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends MongoRepository<UserProfile, String> {

    Optional<UserProfile> findByUserId(Long userId);

    Optional<UserProfile> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UserProfile> findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(
            String name,
            String username
    );

    List<UserProfile> findByUserIdNot(Long userId);
}
