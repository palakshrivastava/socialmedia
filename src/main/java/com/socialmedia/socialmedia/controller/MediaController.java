package com.socialmedia.socialmedia.controller;

import com.socialmedia.socialmedia.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        try {
            String url = mediaService.storeImage(file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Upload failed"));
        }
    }
}
