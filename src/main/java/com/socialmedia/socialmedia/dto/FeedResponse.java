package com.socialmedia.socialmedia.dto;

import com.socialmedia.socialmedia.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedResponse {

    private String mode;
    private List<Post> posts;
}
