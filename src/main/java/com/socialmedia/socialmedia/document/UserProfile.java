package com.socialmedia.socialmedia.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * MongoDB Atlas — user profile and identity for the social graph.
 * {@code userId} matches {@link com.socialmedia.socialmedia.auth.entity.AuthAccount#getId()}.
 */
@Data
@Document(collection = "users")
public class UserProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long userId;

    @Indexed(unique = true)
    private String email;

    private String name;

    @Indexed
    private String username;

    private String bio;

    private Date createdAt = new Date();
}
