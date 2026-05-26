package com.socialmedia.socialmedia.service;

import com.socialmedia.socialmedia.document.Notification;
import com.socialmedia.socialmedia.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void notifyLike(Long recipientUserId, Long actorUserId, String actorName, String postId) {
        if (recipientUserId.equals(actorUserId)) {
            return;
        }
        save(recipientUserId, actorUserId, actorName, Notification.Type.LIKE, postId,
                actorName + " liked your post");
    }

    public void notifyComment(Long recipientUserId, Long actorUserId, String actorName, String postId, String preview) {
        if (recipientUserId.equals(actorUserId)) {
            return;
        }
        String message = actorName + " commented: \"" + truncate(preview, 60) + "\"";
        save(recipientUserId, actorUserId, actorName, Notification.Type.COMMENT, postId, message);
    }

    public void notifyFollow(Long recipientUserId, Long actorUserId, String actorName) {
        if (recipientUserId.equals(actorUserId)) {
            return;
        }
        save(recipientUserId, actorUserId, actorName, Notification.Type.FOLLOW, null,
                actorName + " started following you");
    }

    private void save(
            Long recipientUserId,
            Long actorUserId,
            String actorName,
            Notification.Type type,
            String postId,
            String message
    ) {
        Notification notification = new Notification();
        notification.setRecipientUserId(recipientUserId);
        notification.setActorUserId(actorUserId);
        notification.setActorName(actorName);
        notification.setType(type);
        notification.setPostId(postId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientUserIdAndReadFalse(userId);
    }

    public void markAllRead(Long userId) {
        List<Notification> unread =
                notificationRepository.findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unread) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    private String truncate(String text, int max) {
        if (text == null) {
            return "";
        }
        return text.length() <= max ? text : text.substring(0, max) + "…";
    }
}
