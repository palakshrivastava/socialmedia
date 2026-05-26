package com.socialmedia.socialmedia.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "notifications")
public class Notification {

    public enum Type {
        LIKE, COMMENT, FOLLOW
    }

    @Id
    private String id;

    @Indexed
    private Long recipientUserId;

    private Long actorUserId;
    private String actorName;
    private Type type;
    private String postId;
    private String message;

    private boolean read = false;

    @Indexed
    private Date createdAt = new Date();
}
