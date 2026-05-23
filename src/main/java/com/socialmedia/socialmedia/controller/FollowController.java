package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.dto.FollowRequest;
import com.socialmedia.socialmedia.entity.Follow;
import com.socialmedia.socialmedia.service.FollowService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin("*")
public class FollowController {

    @Autowired
    private FollowService followService;

    // FOLLOW / UNFOLLOW
    @PostMapping
    public String toggleFollow(@RequestBody FollowRequest request) {

        return followService.toggleFollow(
                request.getFollowerId(),
                request.getFollowingId()
        );
    }

    // GET FOLLOWERS
    @GetMapping("/followers/{userId}")
    public List<Follow> getFollowers(@PathVariable Long userId) {

        return followService.getFollowers(userId);
    }

    // GET FOLLOWING
    @GetMapping("/following/{userId}")
    public List<Follow> getFollowing(@PathVariable Long userId) {

        return followService.getFollowing(userId);
    }
}