package com.example.quizapp.Controllers;


import com.example.quizapp.Services.QuizService;
import com.example.quizapp.dto.QuestionDto;
import com.example.quizapp.dto.QuizDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class QuizRestController {

    @Autowired
    private QuizService quizService;
    @PostMapping("/quiz")
    public ResponseEntity<?> createQuiz(@RequestBody QuizDto dto){
        try{
            return  new ResponseEntity<>((quizService.createQuiz(dto)), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/question")
    public ResponseEntity<?> addQuestionInQuiz(@RequestBody QuestionDto dto){
        try{
            return new ResponseEntity<>(quizService.addQuestionInQuiz(dto), HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping()
    public ResponseEntity<?> getAllTests(){
        try{
            return new ResponseEntity<>(quizService.getAllQuizes(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
