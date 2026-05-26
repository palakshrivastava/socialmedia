package com.socialmedia.socialmedia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class MediaService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String storeImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, GIF, and WebP images are allowed");
        }

        Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(directory);

        String extension = switch (contentType) {
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };

        String filename = UUID.randomUUID() + extension;
        Path target = directory.resolve(filename);
        Files.copy(file.getInputStream(), target);

        return "/uploads/" + filename;
    }
}
