package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.dto.SocialSyncDto;
import com.socialmedia.socialmedia.dto.UserDto;
import com.socialmedia.socialmedia.document.UserProfile;
import com.socialmedia.socialmedia.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialService {

    @Autowired
    private FollowService followService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public SocialSyncDto sync(Long userId) {
        return new SocialSyncDto(
                followService.getFollowers(userId).size(),
                followService.getFollowing(userId).size(),
                notificationService.getUnreadCount(userId),
                notificationService.getNotifications(userId),
                followService.getFollowers(userId),
                followService.getFollowing(userId)
        );
    }

    public List<UserDto> searchUsers(String query, Long currentUserId) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }

        String term = query.trim();
        return userProfileRepository
                .findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(term, term)
                .stream()
                .filter(profile -> !profile.getUserId().equals(currentUserId))
                .map(UserDto::from)
                .limit(12)
                .toList();
    }

    public List<UserDto> getFollowSuggestions(Long userId, int limit) {
        List<Long> followingIds = followService.getFollowing(userId).stream()
                .map(f -> f.getFollowingId())
                .toList();

        return userProfileRepository.findByUserIdNot(userId).stream()
                .filter(profile -> !followingIds.contains(profile.getUserId()))
                .limit(limit)
                .map(UserDto::from)
                .toList();
    }
}
