package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.dto.FeedResponse;
import com.socialmedia.socialmedia.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class FeedController {

    @Autowired
    private FeedService feedService;

    @GetMapping
    public FeedResponse getFeed(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "for-you") String mode
    ) {
        return new FeedResponse(mode, feedService.getFeed(userId, mode));
    }
}
