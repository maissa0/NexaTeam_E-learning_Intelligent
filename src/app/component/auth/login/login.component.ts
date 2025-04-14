import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  isLoading = false;
  show2FA = false;
  twoFactorCode = '';
  jwtToken = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { username, password, rememberMe } = this.loginForm.value;

    this.authService.login(username, password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.is2faEnabled) {
            // If 2FA is enabled, show the 2FA input
            this.show2FA = true;
            this.jwtToken = response.jwtToken;
          } else {
            // Verify the token is saved before redirecting
            console.log('Login successful, token saved:', this.authService.getAuthStatus().token);
            
            // Add a small delay to ensure token is saved in localStorage
            setTimeout(() => {
              // Navigate to profile page if 2FA is not enabled
              this.router.navigate(['/pages/profile']);
            }, 100);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to login. Please check your credentials.';
        }
      });
  }

  onSubmit2FA(): void {
    if (!this.twoFactorCode || this.twoFactorCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    this.isLoading = true;
    this.authService.verify2FA(parseInt(this.twoFactorCode), this.jwtToken)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/pages/profile']);
          } else {
            this.errorMessage = 'Invalid two-factor authentication code';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to verify code';
        }
      });
  }

  goToLanding(): void {
    this.router.navigate(['/user-landing']);
  }
} 