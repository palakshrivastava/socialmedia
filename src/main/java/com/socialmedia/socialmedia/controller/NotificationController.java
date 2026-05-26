package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.document.Notification;
import com.socialmedia.socialmedia.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        return notificationService.getNotifications(userId);
    }

    @GetMapping("/{userId}/unread-count")
    public Map<String, Long> getUnreadCount(@PathVariable Long userId) {
        return Map.of("count", notificationService.getUnreadCount(userId));
    }

    @PutMapping("/{userId}/read-all")
    public Map<String, String> markAllRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);
        return Map.of("message", "All notifications marked as read");
    }
}
