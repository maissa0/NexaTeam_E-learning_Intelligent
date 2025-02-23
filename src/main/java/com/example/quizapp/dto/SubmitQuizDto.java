package com.example.quizapp.dto;


import lombok.Data;

import java.util.List;

@Data
public class SubmitQuizDto {

    private Long quizId;
    private Long userId;

    private List<QuestionResponse> responses ;

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<QuestionResponse> getResponses() {
        return responses;
    }

    public void setResponses(List<QuestionResponse> responses) {
        this.responses = responses;
    }
}
