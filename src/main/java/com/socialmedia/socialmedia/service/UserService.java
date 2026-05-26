package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.auth.entity.AuthAccount;
import com.socialmedia.socialmedia.auth.repository.AuthAccountRepository;
import com.socialmedia.socialmedia.document.UserProfile;
import com.socialmedia.socialmedia.dto.AuthResponse;
import com.socialmedia.socialmedia.dto.LoginRequest;
import com.socialmedia.socialmedia.dto.SignupRequest;
import com.socialmedia.socialmedia.dto.UserDto;
import com.socialmedia.socialmedia.dto.UserProfileDto;
import com.socialmedia.socialmedia.entity.Post;
import com.socialmedia.socialmedia.exception.AuthException;
import com.socialmedia.socialmedia.jwt.JwtUtil;
import com.socialmedia.socialmedia.repository.FollowRepository;
import com.socialmedia.socialmedia.repository.PostRepository;
import com.socialmedia.socialmedia.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private AuthAccountRepository authAccountRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowRepository followRepository;

    @Transactional
    public void signup(SignupRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (authAccountRepository.existsByEmail(email)
                || userProfileRepository.existsByEmail(email)) {
            throw new AuthException("Email already exists", HttpStatus.CONFLICT);
        }

        AuthAccount auth = new AuthAccount();
        auth.setEmail(email);
        auth.setPassword(passwordEncoder.encode(request.getPassword()));
        auth = authAccountRepository.save(auth);

        try {
            UserProfile profile = new UserProfile();
            profile.setUserId(auth.getId());
            profile.setEmail(email);
            profile.setName(request.getName().trim());
            profile.setUsername(UserDto.deriveUsername(email));
            profile.setBio("");
            userProfileRepository.save(profile);
        } catch (RuntimeException ex) {
            authAccountRepository.delete(auth);
            throw ex;
        }
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        AuthAccount auth = authAccountRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(
                        "Invalid email or password",
                        HttpStatus.UNAUTHORIZED
                ));

        if (!passwordEncoder.matches(request.getPassword(), auth.getPassword())) {
            throw new AuthException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        UserProfile profile = userProfileRepository.findByUserId(auth.getId())
                .orElseThrow(() -> new AuthException(
                        "User profile not found",
                        HttpStatus.NOT_FOUND
                ));

        String token = jwtUtil.generateToken(auth.getEmail());

        return new AuthResponse("Login successful", token, UserDto.from(profile));
    }

    public UserDto getUserByEmail(String email) {
        UserProfile profile = userProfileRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.NOT_FOUND));

        return UserDto.from(profile);
    }

    public UserDto getUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AuthException("Missing or invalid token", HttpStatus.UNAUTHORIZED);
        }

        String token = authorizationHeader.substring(7).trim();
        String email = jwtUtil.extractEmail(token);

        return getUserByEmail(email);
    }

    public List<UserDto> getAllUsers() {
        return userProfileRepository.findAll().stream()
                .map(UserDto::from)
                .toList();
    }

    public UserProfileDto getUserProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.NOT_FOUND));

        long postsCount = postRepository.countByUserId(userId);
        long followersCount = followRepository.findByFollowingId(userId).size();
        long followingCount = followRepository.findByFollowerId(userId).size();
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return new UserProfileDto(
                UserDto.from(profile),
                postsCount,
                followersCount,
                followingCount,
                posts
        );
    }
}
