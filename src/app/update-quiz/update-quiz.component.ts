import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-update-quiz',
  templateUrl: './update-quiz.component.html',
  styleUrls: ['./update-quiz.component.css']
})
export class UpdateQuizComponent {
  quizId:any;
  quizForm!: FormGroup;
  message:string='';
  messageType:string='';

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private adminService: AdminService,

    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du quiz dans l'URL
    this.route.paramMap.subscribe(params => {
      this.quizId = +(params.get('id') ?? 0); 
      this.loadQuizData();
    });

    // Initialiser le formulaire
    this.quizForm = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(3)  // Ensure 'title' has a minimum length of 3 characters
      ]], 
    
      descrption: ['', [
        Validators.required, 
        Validators.minLength(10), Validators.maxLength(500) // Ensure 'description' has a minimum length of 10 characters
      ]],
    
      time: ['', [
        Validators.required, 
        Validators.min(5), // Minimum 5 seconds per question
        Validators.pattern('^[0-9]+$')  // Ensure time is a valid number
      ]]
    });
  }

  // Charger les données du quiz
  loadQuizData(): void {
    this.quizService.getQuizById(this.quizId).subscribe(quiz => {
      this.quizForm.patchValue({
        title: quiz.title,
        descrption: quiz.descrption,
        time: quiz.time
      });
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.message = 'Veuillez remplir tous les champs requis !';
      this.messageType = 'error';
      return;
    }
  
    this.adminService.updateQuiz(this.quizId, this.quizForm.value).subscribe({
      next: () => {
        console.log('Quiz mis à jour avec succès');
        this.message = 'Quiz mis à jour avec succès !';
        this.messageType = 'success';
  
        // Attendre 2 secondes avant de rediriger
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du quiz', err);
        this.message = 'Échec de la mise à jour du quiz. Veuillez réessayer.';
        this.messageType = 'error';
      }
    });
  }
  

}
