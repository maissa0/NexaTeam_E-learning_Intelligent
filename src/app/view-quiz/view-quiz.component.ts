import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';  // <-- Add this line


@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent {
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
