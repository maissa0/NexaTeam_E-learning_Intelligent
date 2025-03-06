import { Component } from '@angular/core';
import { QuizServiceService } from '../../service/quiz-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TopbarWidget } from "./topbarwidget.component";
import { HeroWidget } from "./herowidget";
import { FeaturesWidget } from "./featureswidget";
import { HighlightsWidget } from "./highlightswidget";
import { FooterWidget } from "./footerwidget";
import { PricingWidget } from "./pricingwidget";

@Component({
  selector: 'app-start-quiz',
  imports: [RouterModule, CommonModule, TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget, FooterWidget, PricingWidget],
  template: `
  <div style="margin: auto; width: 80%;">
  <div class="timer-container">
    <div class="timer">
      Time remaining: {{ getFormattedTime() }}
    </div>
  </div>
  <div *ngIf="message" class="notification" [ngClass]="messageType">
    {{ message }}
  </div>

  <form>
    <!-- Questions -->
    <div class="question" *ngFor="let question of questions">
      <h3>{{ question.questionText }}</h3>
      <div>
        <label>
          <input type="radio" name="question{{ question.id }}" (change)="onAnswerChange(question.id, 'A')" />
          {{ question.optionA }}
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="question{{ question.id }}" (change)="onAnswerChange(question.id, 'B')" />
          {{ question.optionB }}
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="question{{ question.id }}" (change)="onAnswerChange(question.id, 'C')" />
          {{ question.optionC }}
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="question{{ question.id }}" (change)="onAnswerChange(question.id, 'D')" />
          {{ question.optionD }}
        </label>
      </div>
    </div>

    <button type="button" (click)="submitAnswers()" class="submit-btn">
      Submit Answers
    </button>
  </form>

  <!-- Résultats du quiz après soumission -->
  <div *ngIf="messageType === 'success'" class="result">
    <h3>Quiz Results</h3>
    <p>Total Questions: {{ totalQuestions }}</p>
    <p>Correct Answers: {{ correctAnswersCount }}</p>
    <p>Incorrect Answers: {{ incorrectAnswersCount }}</p>
    <p>Your Score: {{ percentage.toFixed(2) }}%</p>
  </div>
</div>

`,
  styles: `.question {
    padding: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin-top: 30px;
    border-radius: 5px;
  }
  .timer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .timer {
    background-color: #f0f2f5;
    border: 2px solid #1890ff;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 1.5rem;
    font-weight: bold;
    color: #1890ff;
    text-align: center;
    width: fit-content;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  .notification {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  .submit-btn {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .submit-btn:hover {
    background: linear-gradient(135deg, #0056b3, #003d82);
    transform: scale(1.05);
  }
  
  .submit-btn:disabled {
    background: gray;
    cursor: not-allowed;
  }
  
  .submit-btn i {
    font-size: 18px;
  }
  .result {
  margin-top: 30px;
  padding: 20px;
  background-color: #f4f8fb;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.result h3 {
  color: #007bff;
  margin-bottom: 15px;
}

.result p {
  font-size: 1.1rem;
  color: #333;
}

  `
})
export class StartQuizComponent {
  [x: string]: any;

  questions: any[] = [];
  quizId:any;
  userId:any;
  quizTitle:any;
  correctAnswersCount: number = 0;
incorrectAnswersCount: number = 0;
totalQuestions: number = 0;
percentage: number = 0;


  selectedAnswers: { [key: string]: string } = {};
  timeRemaining:number=300; 
  message:string='';
  messageType:string='';// Ensures TypeScript knows the structure
  interval: any; 
  constructor(private quizService: QuizServiceService,
    private activateRoute:ActivatedRoute , private route :Router) { }
    ngOnInit() {
      this.activateRoute.paramMap.subscribe(params => {
        const quizIdParam = params.get('id');
        
        if (quizIdParam) {
          this.quizId = +quizIdParam; // Convert to number if it's not null
          
          // Fetch quiz questions and details using the getQuizQuestion method
          this.quizService.getQuizQuestion(this.quizId).subscribe(res => {
            console.log('API Response:', res); // Debugging step
            
            this.questions = res?.questions || []; // Ensure questions array is not undefined
            console.log('Questions:', this.questions);
    
            if (res?.quizDto) {
              this.quizTitle = res.quizDto.title; // Store quiz title from the quizDto
              console.log('Quiz Title:', this.quizTitle);
    
              this.timeRemaining = Number(res.quizDto.time) || 300; // Set quiz time
              this.startTimer(); // Start timer based on the quiz time
            } else {
              console.error('quizDto is undefined in API response:', res);
              this.timeRemaining = 300; // Default fallback time if no time found
            }
    
            console.log('Quiz Time Set:', this.timeRemaining);
          });
        } else {
          console.error('Quiz ID not found in the route params.');
          // Handle the case where QuizId is not available, if necessary
        }
      });
    }
    
    startTimer() {
      this.interval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          clearInterval(this.interval);
          this.submitAnswers();
        }
      }, 1000);
    }

    getFormattedTime(): string {
  const minutes = Math.floor(this.timeRemaining / 60);  // Get minutes
  const seconds = this.timeRemaining % 60;  // Get seconds
  return `${minutes} minutes ${seconds} seconds`;
}


    onAnswerChange(questionId: number, selectedOption: string) {
      this.selectedAnswers[questionId] = selectedOption;
      
      console.log(this.selectedAnswers);
    }
    submitAnswers() {
       const answerList = Object.keys(this.selectedAnswers).map(questionId => ({
    questionId: +questionId,
    selectedOption: this.selectedAnswers[questionId]
  }));

  const data = {
    quizId: this.quizId,
    userId: 2, // Temporary default user ID
    responses: answerList
  };

  console.log('Submitting Data:', data); // Debugging

  this.quizService.submitQuiz(data).subscribe({
    next: (response) => {
      console.log('API Response:', response);

      // Vérifier que la réponse contient les informations attendues
      if (response && response.correctAnswers !== undefined && response.totalQuestions !== undefined && response.percentage !== undefined) {
        this.correctAnswersCount = response.correctAnswers;
        this.incorrectAnswersCount = response.totalQuestions - this.correctAnswersCount;
        this.totalQuestions = response.totalQuestions;
        this.percentage = response.percentage;

        // Message à afficher après la soumission
        this.message = `Quiz submitted successfully! Your score is: ${this.percentage.toFixed(2)}% (${this.correctAnswersCount} out of ${this.totalQuestions} correct)`;
        this.messageType = 'success';
        
        // Attendre 2 secondes avant de rediriger
        setTimeout(() => this.route.navigate(['user-dashboard']), 2000);
      } else {
        // Gérer le cas où la réponse ne contient pas les informations nécessaires
        this.message = 'Invalid response format. Please try again later.';
        this.messageType = 'error';
      }
    },
    error: (err) => {
      console.error('API Error:', err);
      this.message = 'Failed to submit quiz. Please try again.';
      this.messageType = 'error';
    }
  });
    }
  }
