package com.socialmedia.socialmedia.dto;

import lombok.Data;

@Data
public class CommentRequest {

    private Long userId;
    private String comment;
}