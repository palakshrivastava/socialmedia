package com.socialmedia.socialmedia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** MongoDB Atlas — social posts; {@code userId} references {@code users.userId}. */
@Data
@Document(collection = "posts")
public class Post {

    @Id
    private String id;
    private Long userId;
    private String caption;
    private String imageUrl;
    private Date createdAt = new Date();
    private List<Long> likes = new ArrayList<>();

    /** Supports legacy string comments and new comment documents in MongoDB. */
    @JsonIgnore
    @Field("comments")
    private List<Object> commentItems = new ArrayList<>();

    @JsonProperty("comments")
    public List<PostComment> getComments() {
        if (commentItems == null) {
            return List.of();
        }
        return commentItems.stream()
                .map(this::toComment)
                .filter(comment -> comment != null)
                .collect(Collectors.toList());
    }

    public void addComment(PostComment comment) {
        if (commentItems == null) {
            commentItems = new ArrayList<>();
        }
        commentItems.add(comment);
    }

    private PostComment toComment(Object raw) {
        if (raw == null) {
            return null;
        }
        if (raw instanceof PostComment postComment) {
            return postComment;
        }
        if (raw instanceof String text) {
            PostComment comment = new PostComment();
            comment.setText(text);
            comment.setAuthorName("Member");
            return comment;
        }
        if (raw instanceof org.bson.Document document) {
            return mapToComment(document);
        }
        if (raw instanceof Map<?, ?> map) {
            return mapToComment(map);
        }
        return null;
    }

    private PostComment mapToComment(Map<?, ?> map) {
        PostComment comment = new PostComment();
        Object userId = map.get("userId");
        if (userId instanceof Number number) {
            comment.setUserId(number.longValue());
        }
        Object authorName = map.get("authorName");
        if (authorName != null) {
            comment.setAuthorName(String.valueOf(authorName));
        }
        Object text = map.get("text");
        if (text != null) {
            comment.setText(String.valueOf(text));
        } else {
            Object commentVal = map.get("comment");
            comment.setText(commentVal != null ? String.valueOf(commentVal) : "");
        }
        return comment;
    }
}
