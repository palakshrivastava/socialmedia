package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.dto.UserDto;
import com.socialmedia.socialmedia.dto.UserProfileDto;
import com.socialmedia.socialmedia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/auth/me")
    public UserDto getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return userService.getUserFromToken(authorization);
    }

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{userId}/profile")
    public UserProfileDto getUserProfile(@PathVariable Long userId) {
        return userService.getUserProfile(userId);
    }
}
