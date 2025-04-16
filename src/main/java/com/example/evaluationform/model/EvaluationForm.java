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
    private String evaluationId;

    private String applicationId;

    private String evaluatorId;
    private String evaluatorName;

    private Map<String, Integer> scores;
    private String overallFeedback;

    private EvaluationStatus status;

    private LocalDateTime createdAt;
}
