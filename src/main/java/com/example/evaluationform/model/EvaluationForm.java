package com.example.evaluationform.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "evaluation_forms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationForm {

    @Id
    private String evaluationId;  // MongoDB uses String (ObjectId)

    private String applicationId; // Link to the interview being evaluated

    private String evaluatorId; // Recruiter or interviewer ID
    private String evaluatorName; // Name of the person evaluating

    private Map<String, Integer> scores; // Key: "Technical Skills", "Communication", etc. | Value: Rating (1-10)

    private String overallFeedback; // Comments about the candidate

    private EvaluationStatus status; // Enum: PENDING, SUBMITTED, REVIEWED

    private LocalDateTime createdAt;
}
