package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.entity.Follow;
import com.socialmedia.socialmedia.entity.Post;
import com.socialmedia.socialmedia.repository.FollowRepository;
import com.socialmedia.socialmedia.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FeedService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowRepository followRepository;

    public List<Post> getFeed(Long userId, String mode) {
        if ("following".equalsIgnoreCase(mode)) {
            return getFollowingFeed(userId);
        }
        if ("discover".equalsIgnoreCase(mode)) {
            return getDiscoverFeed(userId);
        }
        return getForYouFeed(userId);
    }

    public List<Post> getFollowingFeed(Long userId) {
        List<Long> followingIds = followRepository.findByFollowerId(userId).stream()
                .map(Follow::getFollowingId)
                .collect(Collectors.toList());

        if (followingIds.isEmpty()) {
            return List.of();
        }

        return sortNewest(postRepository.findByUserIdInOrderByCreatedAtDesc(followingIds));
    }

    public List<Post> getDiscoverFeed(Long userId) {
        Set<Long> followingIds = followRepository.findByFollowerId(userId).stream()
                .map(Follow::getFollowingId)
                .collect(Collectors.toSet());

        List<Post> discovery = postRepository.findAll().stream()
                .filter(post -> !post.getUserId().equals(userId))
                .filter(post -> !followingIds.contains(post.getUserId()))
                .collect(Collectors.toList());

        Collections.shuffle(discovery);
        return sortNewest(discovery);
    }

    public List<Post> getForYouFeed(Long userId) {
        List<Post> followingPosts = getFollowingFeed(userId);
        List<Post> discoverPosts = getDiscoverFeed(userId);

        List<Post> mixed = new ArrayList<>();
        int fi = 0;
        int di = 0;

        while (fi < followingPosts.size() || di < discoverPosts.size()) {
            for (int i = 0; i < 2 && fi < followingPosts.size(); i++) {
                mixed.add(followingPosts.get(fi++));
            }
            if (di < discoverPosts.size()) {
                mixed.add(discoverPosts.get(di++));
            }
        }

        if (mixed.isEmpty()) {
            return sortNewest(
                    postRepository.findAll().stream()
                            .filter(post -> !post.getUserId().equals(userId))
                            .collect(Collectors.toList())
            );
        }

        return mixed;
    }

    private List<Post> sortNewest(List<Post> posts) {
        return posts.stream()
                .sorted(Comparator.comparing(
                        Post::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .collect(Collectors.toList());
    }
}
