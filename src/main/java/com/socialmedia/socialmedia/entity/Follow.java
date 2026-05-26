package com.socialmedia.socialmedia.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** MongoDB Atlas — follow graph; ids reference {@code users.userId}. */
@Data
@Document(collection = "follows")
public class Follow {
    @Id
    private String id;
    private Long followerId;
    private Long followingId;
}