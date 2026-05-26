package com.socialmedia.socialmedia.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * PostgreSQL (JPA): auth credentials only.
 * MongoDB: user profiles, posts, follows.
 */
@Configuration
@EntityScan(basePackages = "com.socialmedia.socialmedia.auth.entity")
@EnableJpaRepositories(basePackages = "com.socialmedia.socialmedia.auth.repository")
@EnableMongoRepositories(basePackages = "com.socialmedia.socialmedia.repository")
public class DatabaseConfig {
}
