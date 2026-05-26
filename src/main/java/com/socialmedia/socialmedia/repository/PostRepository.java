package com.socialmedia.socialmedia.repository;

import com.socialmedia.socialmedia.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    long countByUserId(Long userId);

    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Post> findByUserIdInOrderByCreatedAtDesc(List<Long> userIds);
}