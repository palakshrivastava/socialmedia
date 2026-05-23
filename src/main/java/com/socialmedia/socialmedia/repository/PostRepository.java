package com.socialmedia.socialmedia.repository;

import com.socialmedia.socialmedia.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}