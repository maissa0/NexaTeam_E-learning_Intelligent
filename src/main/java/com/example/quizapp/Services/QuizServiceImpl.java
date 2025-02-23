package com.example.quizapp.Services;


import com.example.quizapp.Entities.Question;
import com.example.quizapp.Entities.Quiz;
import com.example.quizapp.Repo.QuestionRepository;
import com.example.quizapp.Repo.QuizRepository;
import com.example.quizapp.dto.QuestionDto;
import com.example.quizapp.dto.QuizDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;


    public QuizDto createQuiz(QuizDto dto){
         Quiz quiz = new Quiz();
         quiz.setTitle(dto.getTitle());
         quiz.setDescrption(dto.getDescrption());
         quiz.setTime(dto.getTime());

         return quizRepository.save(quiz).getDto();
    }
    public QuestionDto addQuestionInQuiz(QuestionDto dto) {

        Optional<Quiz> optionalQuiz = quizRepository.findById(dto.getId());

        if (optionalQuiz.isPresent()){

            Question question = new Question();

            question.setQuiz(optionalQuiz.get());

            question.setQuestionText(dto.getQuestionText());

            question.setOptionA(dto.getOptionA());

            question.setOptionB(dto.getOptionB());

            question.setOptionC(dto.getOptionC());

            question.setOptionD(dto.getOptionD());

            question.setCorrectOption(dto.getCorrectOption());

            return questionRepository.save(question).getDto();

        }

        throw new EntityNotFoundException("Test Not Found");
    }
    public List<QuizDto> getAllQuizes() {
        return quizRepository.findAll().stream()
                .peek(quiz -> quiz.setTime(quiz.getQuestions().size() * quiz.getTime()))
                .collect(Collectors.toList())
                .stream().map(Quiz::getDto).collect(Collectors.toList());

    }
}
