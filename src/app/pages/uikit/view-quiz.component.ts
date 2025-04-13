import { Component, Input } from '@angular/core';
import { AdminService } from '../service/admin-service.service';
import { ActivatedRoute } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';





@Component({
  selector: 'app-view-quiz',
  standalone: true,
  imports: [
    RadioButtonModule,
    CommonModule,
    FormsModule,
    CardModule


  ],
  template: `<p-card *ngFor="let question of questions; let i = index" class="question-card shadow-md p-4 mb-4 border border-gray-200 rounded-lg">
  <ng-template pTemplate="header">
    <h5 class="text-lg font-semibold text-primary">Question {{ i + 1 }}</h5>
  </ng-template>

  <ng-template pTemplate="content">
    <p class="text-sm font-medium mb-2">{{ question.text }}</p>

    <div class="grid grid-cols-1 gap-2">
      <div *ngFor="let option of ['A', 'B', 'C', 'D']; let j = index" 
           class="option-card flex items-center gap-3 p-2 border rounded-md hover:bg-gray-100 transition duration-200">
        <p-radioButton 
          [name]="'question' + question.id"
          [value]="option"
          [(ngModel)]="question.selectedAnswer"
          inputId="option{{ question.id }}{{ j }}"
          class="cursor-pointer"
        ></p-radioButton>
        <label 
          for="option{{ question.id }}{{ j }}" 
          class="text-sm font-medium cursor-pointer">
          {{ question['option' + option] }}
        </label>
      </div>
    </div>
  </ng-template>
</p-card>

`,
styles:`/* General Card Styles */
.question-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}

/* Header Styling */
p-card header {
  margin-bottom: 12px;
}

h5 {
  color: #4CAF50; /* Green for headings */
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
}

/* Content Styling */
p {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

/* Option Card Styling */
.option-card {
  padding: 10px;
  background-color: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: background-color 0.3s ease, border 0.3s ease;
}

.option-card:hover {
  background-color: #f0fdf4; /* Light green on hover */
  border-color: #4CAF50; /* Highlight on hover */
}

/* Radio Button Styling */
p-radioButton {
  margin-right: 10px;
  font-size: 1.1rem;
  color: #4CAF50;
}

/* Label Styling */
label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
}

/* Grid Layout */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .question-card {
    padding: 14px;
  }

  h5 {
    font-size: 16px;
  }

  .option-card {
    padding: 8px;
  }

  label {
    font-size: 13px;
  }
}

`,
  providers:[]
})
export class ViewQuizComponent {
  @Input() quizId!: number;


  questions : any[] = [];
  QuizId:any;

  constructor(private adminService : AdminService,
    private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
      this.activatedRoute.paramMap.subscribe(params => {
        const quizIdParam = params.get('id');
        
        if (quizIdParam) {
          this.QuizId = +quizIdParam; // Convert to number if it's not null
          this.adminService.getQuizQuestion(this.QuizId).subscribe(res => {
            this.questions = res.questions;
            console.log(this.questions);
          });
        } else {
          console.error('Quiz ID not found in the route params.');
          // Handle the case where QuizId is not available, if necessary
        }
      });
    }
}
