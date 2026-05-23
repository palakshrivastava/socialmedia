package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.entity.Follow;
import com.socialmedia.socialmedia.repository.FollowRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    // FOLLOW / UNFOLLOW
    public String toggleFollow(Long followerId, Long followingId) {

        Follow existingFollow =
                followRepository.findByFollowerIdAndFollowingId(
                        followerId,
                        followingId
                );

        // already following -> unfollow
        if(existingFollow != null) {

            followRepository.delete(existingFollow);

            return "Unfollowed successfully";
        }

        // follow
        Follow follow = new Follow();

        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);

        followRepository.save(follow);

        return "Followed successfully";
    }

    // GET FOLLOWERS
    public List<Follow> getFollowers(Long userId) {

        return followRepository.findByFollowingId(userId);
    }

    // GET FOLLOWING
    public List<Follow> getFollowing(Long userId) {

        return followRepository.findByFollowerId(userId);
    }
}