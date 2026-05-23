package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.dto.PostRequest;
import com.socialmedia.socialmedia.entity.Post;
import com.socialmedia.socialmedia.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // CREATE POST
    public Post createPost(PostRequest request) {

        Post post = new Post();

        post.setUserId(request.getUserId());
        post.setCaption(request.getCaption());
        post.setImageUrl(request.getImageUrl());

        return postRepository.save(post);
    }

    // GET ALL POSTS
    public List<Post> getAllPosts() {

        return postRepository.findAll();
    }

    // LIKE / UNLIKE POST
    public Post toggleLike(String postId, Long userId) {

        Post post = postRepository.findById(postId).orElseThrow();

        // already liked
        if(post.getLikes().contains(userId)) {

            post.getLikes().remove(userId);

        } else {

            post.getLikes().add(userId);
        }

        return postRepository.save(post);
    }

    // ADD COMMENT
    public Post addComment(String postId, String comment) {

        Post post = postRepository.findById(postId).orElseThrow();

        post.getComments().add(comment);

        return postRepository.save(post);
    }
}