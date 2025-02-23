package com.example.quizapp.Services;

import com.example.quizapp.Entities.Quiz;
import com.example.quizapp.dto.QuestionDto;
import com.example.quizapp.dto.QuizDto;

import java.util.List;

public interface QuizService {

    QuizDto createQuiz(QuizDto dto);
    QuestionDto addQuestionInQuiz(QuestionDto dto);
    List<QuizDto> getAllQuizes();
}
