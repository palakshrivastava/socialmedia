package com.socialmedia.socialmedia.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private Long userId;

    private String caption;

    private String imageUrl;

    private Date createdAt = new Date();

    // Likes
    private List<Long> likes = new ArrayList<>();

    // Comments
    private List<String> comments = new ArrayList<>();
}