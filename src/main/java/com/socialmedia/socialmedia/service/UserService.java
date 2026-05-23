package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.dto.LoginRequest;
import com.socialmedia.socialmedia.dto.SignupRequest;
import com.socialmedia.socialmedia.entity.User;
import com.socialmedia.socialmedia.jwt.JwtUtil;
import com.socialmedia.socialmedia.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // SIGNUP
    public String signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()) != null) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // ENCRYPT PASSWORD
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User registered successfully";
    }

    // LOGIN
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return "User not found";
        }

        // CHECK PASSWORD
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid password";
        }

        // GENERATE JWT TOKEN
        return jwtUtil.generateToken(user.getEmail());
    }
}