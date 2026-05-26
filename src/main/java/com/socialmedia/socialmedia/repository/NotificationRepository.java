package com.socialmedia.socialmedia.repository;

import com.socialmedia.socialmedia.document.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientUserId);

    long countByRecipientUserIdAndReadFalse(Long recipientUserId);

    List<Notification> findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(Long recipientUserId);
}
