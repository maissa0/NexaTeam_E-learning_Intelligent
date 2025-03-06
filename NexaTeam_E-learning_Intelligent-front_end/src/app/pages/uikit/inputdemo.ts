import { Component, inject, OnInit,Input  } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

import { Router } from '@angular/router';
import { Quiz } from '../Models/quiz';
import { AdminService } from '../service/admin-service.service';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ViewQuizComponent } from './view-quiz.component';
import { QuizServiceService } from '../service/quiz-service.service';
import { FormGroup } from '@angular/forms';




@Component({
    selector: 'app-input-demo',
    standalone: true,
    imports: [
        CardModule,
        DialogModule,
        CommonModule,
        RadioButtonModule,
        NgFor,
        RouterModule,
    ViewQuizComponent

        

       
    ],
    
    template: `<!-- Create Quiz Button -->
    <div class="text-center my-3">
      <button pButton type="button" class="p-button p-button-primary p-button-lg" 
              (click)="navigateToManualQuiz()" label="Create Quiz">
        <i class="pi pi-plus-circle"></i> Create Quiz
      </button>
    </div>
    
    <!-- Modal using PrimeNG Dialog -->
    <p-dialog [(visible)]="displayModal" [modal]="true" [closable]="false" 
              header="Quiz Creation" [style]="{width: '400px'}">
      <div class="modal-body text-center">
        <p class="text-lg">Do you want to add the quiz manually or generate it automatically?</p>
        <div class="flex justify-content-center gap-3 mt-3">
          <button pButton class="p-button p-button-success p-button-lg" 
                  (click)="navigateToManualQuiz()" label="Manually">
            <i class="pi pi-pencil"></i> Manually
          </button>
          <div class="form-item">
  <button type="button" (click)="generateQuizAutomatically()" class="submit-button">Generate Quiz Automatically</button>
</div>



        </div>
      </div>
    </p-dialog>
    
    <!-- Main Quiz List -->
    <div class="main container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4" *ngFor="let quiz of Quizes">
          <p-card class="shadow-lg">
            <ng-template pTemplate="header">
              <div class="bg-primary text-white text-center p-3">
                <h5 class="m-0">{{ quiz.title }}</h5>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <p><strong>Time:</strong> 
                <span class="badge bg-info p-2">{{ getFormattedTime(quiz.time) }} seconds</span>
              </p>
              <p><strong>Description:</strong> {{ quiz.descrption }}</p>
    
              <div class="d-flex justify-content-between mt-3">
              <button pButton class="p-button p-button-outlined p-button-primary p-button-sm" 
        [routerLink]="['/view', quiz.id]">
    <i class="pi pi-eye"></i> View
</button>

<button pButton class="p-button p-button-outlined p-button-success p-button-sm" 
  [routerLink]="['/add-question', quiz.id]">
  <i class="pi pi-plus"></i> Add Question
</button>



              </div>
    
              <div class="d-flex justify-content-between mt-3">
    <a class="icon-link" [routerLink]="['/update-quiz', quiz.id]" title="Update">
        <i class="pi pi-pencil text-warning"></i>
    </a>
                <a class="icon-link" (click)="deleteQuiz(quiz.id)" title="Delete">
                  <i class="pi pi-trash text-danger"></i>
                </a>
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>
    </div>
    <div *ngIf="selectedComponent === 'view'">
  <app-view-quiz [quizId]="selectedQuizId"></app-view-quiz>
</div>
    
    `,
    providers: [AdminService
    ]
})

export class InputDemo implements OnInit {
  message:string='';
  messageType:string='';
      QuizForm!: FormGroup;
  
    
    constructor(private router: Router,private QuizService: AdminService, private quizS: QuizServiceService) {}
    generatedQuiz: any;  // Variable pour stocker le quiz généré
    displayModal: boolean = false;
    selectedComponent: string | null = null;
    selectedQuizId: number = 0; // Donne une valeur par défaut
    showComponent(type: string, quizId: number) {
      console.log("Quiz sélectionné :", quizId);
      this.selectedComponent = type;
      this.selectedQuizId = quizId;
  }
 
  generateQuizAutomatically(): void {
    // Logique pour générer le quiz
    console.log('Génération automatique du quiz...');

    // Naviguer vers le composant generated-quiz
    this.router.navigate(['/generated-quiz']);
  }
  
  navigateToManualQuiz() {
    this.displayModal = false;  // Close modal before navigating
    this.router.navigate(['/create-test']);
  }
  
  
    openCreateQuizModal() {
        this.displayModal = true;
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
}
