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
    private String interviewId;

    private String applicationId;

    private LocalDateTime scheduledDateTime;

    private String meetingLink;

    private String recordingLink;

    private InterviewStatus status;

    private LocalDateTime createdAt;


}

