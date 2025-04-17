package com.applications.hrmanagement.Controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:4200")
public class FileController {
    
    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                throw new FileNotFoundException("File not found: " + fileName);
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 