package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.dto.LoginRequest;
import com.socialmedia.socialmedia.dto.SignupRequest;
import com.socialmedia.socialmedia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    // SIGNUP API
    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {

        return userService.signup(request);
    }

    // LOGIN API
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return userService.login(request);
    }
}