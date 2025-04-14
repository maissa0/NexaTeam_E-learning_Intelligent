import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class VerifyComponent implements OnInit {
  token: string | null = null;
  verificationStatus: 'verifying' | 'success' | 'error' = 'verifying';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.verificationStatus = 'error';
      this.errorMessage = 'Invalid verification link. The token is missing.';
      return;
    }

    // Simulate verification process
    setTimeout(() => {
      // In a real app, you would call your auth service to verify the token
      if (this.token === 'valid-token') {
        this.verificationStatus = 'success';
      } else {
        this.verificationStatus = 'error';
        this.errorMessage = 'Invalid or expired verification link.';
      }
    }, 2000);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
} 