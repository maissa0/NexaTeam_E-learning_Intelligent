import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-add-question-in-quiz',
  templateUrl: './add-question-in-quiz.component.html',

    styleUrls: ['./add-question-in-quiz.component.css']
})
export class AddQuestionInQuizComponent {
  constructor(
    private fb: FormBuilder,
    private devicesService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  id: number | null = null;
  questionForm!: FormGroup;

  ngOnInit(){
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required]],
      optionA: ['', [Validators.required]],
      optionB: ['', [Validators.required]],
      optionC: ['', [Validators.required]],
      optionD: ['', [Validators.required]],
      correctOption: ['', [Validators.required]],
      quizId: ['', Validators.required]
    });
    this.id=this.activatedRoute.snapshot.params["id"];
  }
  onSubmit(){
    if (this.questionForm.valid) {
      console.log('Submitting question:', this.questionForm.value);
      
      console.log('Question data being sent:', this.questionForm.value);
      this.devicesService.addQuestionInQuiz(this.questionForm.value).subscribe(
        (res: any) => {
          console.log('Question successfully added', res);
          console.log('Response from server:', res);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error occurred:', error);
          alert('Error: ' + (error.message || 'Unknown error'));
        }
      );
    } else {
      alert('Form is invalid. Please check your inputs.');
    }
  }
  
  }
  
