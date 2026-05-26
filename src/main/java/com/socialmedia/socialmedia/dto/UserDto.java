package com.socialmedia.socialmedia.dto;

import com.socialmedia.socialmedia.document.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String username;
    private String bio;

    public static UserDto from(UserProfile profile) {
        if (profile == null) {
            return null;
        }

        String username = profile.getUsername();
        if (username == null || username.isBlank()) {
            username = deriveUsername(profile.getEmail());
        }

        return new UserDto(
                profile.getUserId(),
                profile.getName(),
                profile.getEmail(),
                username,
                profile.getBio()
        );
    }

    public static String deriveUsername(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        return email.substring(0, email.indexOf('@'));
    }
}
