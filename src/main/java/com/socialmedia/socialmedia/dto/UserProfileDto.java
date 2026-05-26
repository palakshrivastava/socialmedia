package com.socialmedia.socialmedia.dto;

import com.socialmedia.socialmedia.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    private UserDto user;
    private long postsCount;
    private long followersCount;
    private long followingCount;
    private List<Post> posts;
}
