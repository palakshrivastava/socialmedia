package com.socialmedia.socialmedia.entity;

import lombok.Data;

import java.util.Date;

@Data
public class PostComment {

    private Long userId;
    private String authorName;
    private String text;
    private Date createdAt = new Date();
}
