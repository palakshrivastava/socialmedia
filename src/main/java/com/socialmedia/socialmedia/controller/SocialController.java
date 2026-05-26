package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.dto.SocialSyncDto;
import com.socialmedia.socialmedia.dto.UserDto;
import com.socialmedia.socialmedia.service.SocialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/social")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class SocialController {

    @Autowired
    private SocialService socialService;

    @GetMapping("/sync")
    public SocialSyncDto sync(@RequestParam Long userId) {
        return socialService.sync(userId);
    }

    @GetMapping("/search")
    public List<UserDto> search(
            @RequestParam String q,
            @RequestParam Long userId
    ) {
        return socialService.searchUsers(q, userId);
    }

    @GetMapping("/suggestions")
    public List<UserDto> suggestions(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "8") int limit
    ) {
        return socialService.getFollowSuggestions(userId, limit);
    }
}
