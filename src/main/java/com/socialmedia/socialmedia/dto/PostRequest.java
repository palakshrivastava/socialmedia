package com.socialmedia.socialmedia.dto;

import lombok.Data;

@Data
public class PostRequest {

    private Long userId;

    private String caption;

    private String imageUrl;
}