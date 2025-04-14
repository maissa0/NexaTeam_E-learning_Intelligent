package com.esprit.userAuth.controller;

import com.esprit.userAuth.dtos.UserUpdateDTO;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.security.response.MessageResponse;
import com.esprit.userAuth.service.FileStorageService;
import com.esprit.userAuth.service.UserService;
import com.esprit.userAuth.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class ProfilePictureController {

    private static final String PROFILE_PICTURES_DIR = "profile-pictures";

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthUtil authUtil;

    /**
     * Upload a profile picture for the authenticated user
     * @param file The profile picture file
     * @return A response with the updated user information
     */
    @PostMapping("/picture/upload")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            // Check if the file is an image
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Only image files are allowed"));
            }

            // Get the authenticated user
            User user = authUtil.loggedInUser();

            // Delete the old profile picture if it exists
            if (user.getProfilePicture() != null) {
                fileStorageService.deleteFile(user.getProfilePicture());
            }

            // Store the new profile picture
            String filePath = fileStorageService.storeFile(file, PROFILE_PICTURES_DIR);

            // Update the user's profile picture
            UserUpdateDTO updateDTO = new UserUpdateDTO();
            updateDTO.setProfilePicture(filePath);
            User updatedUser = userService.updateUserProfile(user.getUserId(), updateDTO);

            return ResponseEntity.ok(new MessageResponse("Profile picture uploaded successfully"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Could not upload profile picture: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get the profile picture of the authenticated user
     * @return The profile picture file
     */
    @GetMapping("/picture")
    public ResponseEntity<?> getProfilePicture() {
        try {
            // Get the authenticated user
            User user = authUtil.loggedInUser();

            // Check if the user has a profile picture
            if (user.getProfilePicture() == null) {
                return ResponseEntity.notFound().build();
            }

            // Get the file path
            String fileName = user.getProfilePicture().substring(user.getProfilePicture().lastIndexOf("/") + 1);
            Path filePath = fileStorageService.getFilePath(fileName, PROFILE_PICTURES_DIR);
            Resource resource = new UrlResource(filePath.toUri());

            // Check if the file exists
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = determineContentType(fileName);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Delete the profile picture of the authenticated user
     * @return A response indicating success or failure
     */
    @DeleteMapping("/picture")
    public ResponseEntity<?> deleteProfilePicture() {
        try {
            // Get the authenticated user
            User user = authUtil.loggedInUser();

            // Check if the user has a profile picture
            if (user.getProfilePicture() == null) {
                return ResponseEntity.ok(new MessageResponse("No profile picture to delete"));
            }

            // Delete the profile picture
            boolean deleted = fileStorageService.deleteFile(user.getProfilePicture());

            // Update the user's profile
            UserUpdateDTO updateDTO = new UserUpdateDTO();
            updateDTO.setProfilePicture(null);
            User updatedUser = userService.updateUserProfile(user.getUserId(), updateDTO);

            if (deleted) {
                return ResponseEntity.ok(new MessageResponse("Profile picture deleted successfully"));
            } else {
                return ResponseEntity.ok(new MessageResponse("Profile picture reference removed, but file could not be deleted"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Determine the content type of a file based on its extension
     * @param fileName The name of the file
     * @return The content type
     */
    private String determineContentType(String fileName) {
        if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        } else if (fileName.endsWith(".bmp")) {
            return "image/bmp";
        } else if (fileName.endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }
} 