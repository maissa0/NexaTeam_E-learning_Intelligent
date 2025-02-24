import { Component } from '@angular/core';
import { Quiz } from 'src/app/models/quiz';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent {

  Quizes: Quiz[] = [];
  constructor(private quizService : QuizService) { }
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
