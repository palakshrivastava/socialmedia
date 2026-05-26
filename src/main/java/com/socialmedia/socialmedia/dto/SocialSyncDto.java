package com.socialmedia.socialmedia.dto;

import com.socialmedia.socialmedia.document.Notification;
import com.socialmedia.socialmedia.entity.Follow;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialSyncDto {

    private long followerCount;
    private long followingCount;
    private long unreadNotifications;
    private List<Notification> notifications;
    private List<Follow> followers;
    private List<Follow> following;
}
