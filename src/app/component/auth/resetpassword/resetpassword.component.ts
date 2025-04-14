import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, ToastModule],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  submitted = false;
  isLoading = false;
  isSuccess = false;
  isError = false;
  errorMessage = '';
  token = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.isError = true;
        this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
      }
    });

    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetForm.invalid || !this.token) {
      return;
    }

    this.isLoading = true;
    const newPassword = this.resetForm.get('password')?.value;

    this.authService.resetPassword(this.token, newPassword)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSuccess = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Password Reset Successful',
            detail: 'Your password has been reset successfully. You can now login with your new password.'
          });
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = error.error?.message || 'An error occurred while resetting your password. Please try again.';
          this.messageService.add({
            severity: 'error',
            summary: 'Reset Failed',
            detail: this.errorMessage
          });
        }
      });
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
} 