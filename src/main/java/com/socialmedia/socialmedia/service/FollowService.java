package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.document.UserProfile;
import com.socialmedia.socialmedia.entity.Follow;
import com.socialmedia.socialmedia.repository.FollowRepository;
import com.socialmedia.socialmedia.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private NotificationService notificationService;

    public String toggleFollow(Long followerId, Long followingId) {
        Follow existingFollow =
                followRepository.findByFollowerIdAndFollowingId(followerId, followingId);

        if (existingFollow != null) {
            followRepository.delete(existingFollow);
            return "Unfollowed successfully";
        }

        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        followRepository.save(follow);

        userProfileRepository.findByUserId(followerId).ifPresent(actor ->
                notificationService.notifyFollow(followingId, followerId, actor.getName())
        );

        return "Followed successfully";
    }

    public List<Follow> getFollowers(Long userId) {
        return followRepository.findByFollowingId(userId);
    }

    public List<Follow> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId);
    }
}
