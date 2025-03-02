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
  template: `<p-card *ngFor="let question of questions; let i = index" class="shadow-lg p-5 mb-4 border border-gray-200 rounded-lg">
  <ng-template pTemplate="header">
    <h5 class="text-xl font-bold text-primary">Question {{ i + 1 }}</h5>
  </ng-template>

  <ng-template pTemplate="content">
    <p class="text-lg font-semibold mb-3">{{ question.text }}</p>

    <div class="grid grid-cols-1 gap-3">
      <div *ngFor="let option of ['A', 'B', 'C', 'D']; let j = index" class="flex items-center gap-3 p-2 border rounded-md hover:bg-gray-100 transition">
        <p-radioButton 
          [name]="'question' + question.id"
          [value]="option"
          [(ngModel)]="question.selectedAnswer"
          inputId="option{{ question.id }}{{ j }}"
          class="cursor-pointer"
        ></p-radioButton>
        <label 
          for="option{{ question.id }}{{ j }}" 
          class="text-base cursor-pointer">
          {{ question['option' + option] }}
        </label>
      </div>
    </div>
  </ng-template>
</p-card>


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
