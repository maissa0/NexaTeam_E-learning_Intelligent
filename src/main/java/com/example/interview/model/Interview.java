package com.example.interview.model;



import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    private String interviewId;  // MongoDB uses String (ObjectId)

    private String applicationId; // Store applicationId as String instead of referencing JobApplication

    private LocalDateTime scheduledDateTime; // Date & Time of the interview


    private String meetingLink; // Online meeting link (Zoom, Google Meet, etc.)

    private String recordingLink; // Link to the interview recording

    private InterviewStatus status; // Enum: SCHEDULED, COMPLETED, CANCELED


    private LocalDateTime createdAt;


}

