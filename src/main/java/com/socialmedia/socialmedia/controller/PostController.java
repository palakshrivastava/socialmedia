package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.dto.CommentRequest;
import com.socialmedia.socialmedia.dto.LikeRequest;
import com.socialmedia.socialmedia.dto.PostRequest;
import com.socialmedia.socialmedia.entity.Post;
import com.socialmedia.socialmedia.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin("*")
public class PostController {

    @Autowired
    private PostService postService;

    // CREATE POST
    @PostMapping
    public Post createPost(@RequestBody PostRequest request) {

        return postService.createPost(request);
    }

    // GET ALL POSTS
    @GetMapping
    public List<Post> getAllPosts() {

        return postService.getAllPosts();
    }

    // LIKE / UNLIKE
    @PutMapping("/{postId}/like")
    public Post toggleLike(
            @PathVariable String postId,
            @RequestBody LikeRequest request
    ) {

        return postService.toggleLike(postId, request.getUserId());
    }

    // ADD COMMENT
    @PutMapping("/{postId}/comment")
    public Post addComment(
            @PathVariable String postId,
            @RequestBody CommentRequest request
    ) {

        return postService.addComment(postId, request.getComment());
    }
}