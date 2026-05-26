package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.document.UserProfile;
import com.socialmedia.socialmedia.dto.PostRequest;
import com.socialmedia.socialmedia.entity.Post;
import com.socialmedia.socialmedia.entity.PostComment;
import com.socialmedia.socialmedia.repository.PostRepository;
import com.socialmedia.socialmedia.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private NotificationService notificationService;

    public Post createPost(PostRequest request) {
        Post post = new Post();
        post.setUserId(request.getUserId());
        post.setCaption(request.getCaption());
        post.setImageUrl(request.getImageUrl());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post toggleLike(String postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow();

        boolean alreadyLiked = post.getLikes().contains(userId);

        if (alreadyLiked) {
            post.getLikes().remove(userId);
        } else {
            post.getLikes().add(userId);
            userProfileRepository.findByUserId(userId).ifPresent(actor ->
                    notificationService.notifyLike(
                            post.getUserId(),
                            userId,
                            actor.getName(),
                            postId
                    )
            );
        }

        return postRepository.save(post);
    }

    public Post addComment(String postId, Long userId, String text) {
        Post post = postRepository.findById(postId).orElseThrow();

        UserProfile actor = userProfileRepository.findByUserId(userId).orElse(null);
        String authorName = actor != null ? actor.getName() : "Someone";

        PostComment comment = new PostComment();
        comment.setUserId(userId);
        comment.setAuthorName(authorName);
        comment.setText(text);
        post.addComment(comment);

        notificationService.notifyComment(post.getUserId(), userId, authorName, postId, text);

        return postRepository.save(post);
    }
}
