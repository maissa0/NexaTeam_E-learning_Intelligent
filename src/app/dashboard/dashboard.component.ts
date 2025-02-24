import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // <-- Add this line
import { AdminService } from '../services/admin.service';
import { Quiz } from '../models/quiz';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private router: Router,private QuizService: AdminService, ) {}

  navigateToCreateTest() {
    this.router.navigate(['/create-test']); // Navigate to Create Test page
  }

  navigateToViewResults() {
    this.router.navigate(['/view-results']); // Navigate to View Results page
  }
  
  Quizes: Quiz[] = [];
  ngOnInit(): void {
    this.getAllQuiz();
}
getAllQuiz(){
  this.QuizService.getAllQuiz().subscribe(
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
deleteQuiz(id: number) {
  if (confirm("Are you sure you want to delete this quiz?")) {
    this.QuizService.deleteQuiz(id).subscribe(
      () => {
        console.log(`Quiz avec ID ${id} supprimé`);
        this.QuizService.getAllQuiz(); // Récupérer les quiz mis à jour depuis le backend
      },
      (error) => {
        console.error("Erreur lors de la suppression du quiz :", error);
      }
    );
  }
}



updateQuiz(id: number) {
  this.router.navigate([`/update-quiz/${id}`]); 
}



}
