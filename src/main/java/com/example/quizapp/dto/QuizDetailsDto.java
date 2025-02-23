package com.example.quizapp.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizDetailsDto {
    private QuizDto quizDto;

    private List<QuestionDto> questions ;

    public QuizDto getQuizDto() {
        return quizDto;
    }

    public void setQuizDto(QuizDto quizDto) {
        this.quizDto = quizDto;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }
}
