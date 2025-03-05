import { Component } from '@angular/core';
import { QuizServiceService } from '../../service/quiz-service.service';
import { Quiz } from '../../Models/quiz';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-user-dashboard',
  imports: [RouterModule,CommonModule],
  template: `<div class="main">
  <div class="row" style="margin-bottom: 20px;">
    <div class="col-12 col-md-6 col-lg-4" *ngFor="let quiz of Quizes" style="margin: 20px;">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
          <h5>{{ quiz.title }}</h5>
        </div>
        <div class="card-body">
          <p><strong>Time:</strong> <span class="badge bg-info">{{ getFormattedTime(quiz.time) }} seconds</span></p>
          <p><strong>Description:</strong> {{ quiz.descrption }}</p>
          <div class="d-flex justify-content-between">
          <button class="btn btn-primary btn-sm" [routerLink]="['/start-quiz', quiz.id]">Start Quiz</button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
    <a routerLink="/view-results" class="btn btn-outline-primary btn-lg">
      <i class="fas fa-chart-line"></i> View Results
    </a>
  </div>

  </div>`,
  styles: `  /* Media query for smaller screens */
  @media (max-width: 768px) {
    .menu-container {
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-left: 0;
      padding: 0; /* Remove unnecessary padding */
    }
  
    .menu-item {
      font-size: 18px; /* Slightly smaller font size for mobile */
      margin-bottom: 50px; /* Adjusted margin for vertical spacing */
    }
  
    .menu-item:hover {
      color: #ff6f61; /* Change hover color for mobile */
    }
  }
  
  
  
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f7fc;
    margin: 0;
    padding: 0;
  }
  
  /* Main container styling */
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px;
  }
  
  /* Row styling for responsive layout */
  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 100%;
  }
  /* Enhance the card layout */
  .card {
    padding: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin-top: 30px;
    border-radius: 5px;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  /* Improve spacing and responsiveness */
  .main {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  
  .card-header {
    font-size: 1.25rem;
    text-align: center;
    padding: 15px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .card-body p {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .badge {
    font-size: 1rem;
  }
  
  /* Button styling */
  button {
    margin-top: 10px;
    padding: 8px 15px;
  }
  
  .d-flex {
    margin-top: 10px;
  }
  
  /* Make cards responsive */
  @media (max-width: 767px) {
    .col-12 {
      margin: 10px;
    }
  }
  
  /* Button styling */
  button {
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  /* Styling for primary button */
  .btn-primary {
    background-color: #3498db;
    color: white;
    border: none;
    margin-right: 10px;
  }
  
  /* Hover effect for primary button */
  .btn-primary:hover {
    background-color: #2980b9;
  }
  
  /* Styling for secondary button */
  .btn-secondary {
    background-color: #95a5a6;
    color: white;
    border: none;
  }
  
  /* Hover effect for secondary button */
  .btn-secondary:hover {
    background-color: #7f8c8d;
  }`
})
export class UserDashboardComponent {
  
  Quizes: Quiz[] = [];
  constructor(private quizService : QuizServiceService) { }
  ngOnInit(): void {
    this.getAllQuiz();
}
getAllQuiz(){
  this.quizService.getAllQuiz().subscribe(
    (res: any) => {
      console.log("Quiz récupérés avec succès :", res);
      this.Quizes = res; // Stocker les quiz récupérés
    },
    (error) => {
      console.error("Erreur lors de la récupération des quiz :", error);
    }
  );
}
getFormattedTime(time: number): string {
  const minutes = Math.floor(time / 60);  // Convertit le temps en minutes
  const seconds = time % 60;              // Récupère les secondes restantes
  return `${minutes} minutes ${seconds} seconds`;  // Utilise les backticks pour interpoler correctement
}

}
