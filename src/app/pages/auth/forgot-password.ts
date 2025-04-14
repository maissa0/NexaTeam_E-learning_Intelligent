import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        RippleModule,
        ToastModule,
        AppFloatingConfigurator
    ],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Forgot Password</div>
                            <span class="text-muted-color font-medium">Enter your email to reset your password</span>
                        </div>

                        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
                            <div class="mb-6">
                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input pInputText id="email" type="email" placeholder="Email address" class="w-full" formControlName="email" />
                                <small *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched" class="text-red-500">
                                    Valid email is required
                                </small>
                            </div>

                            <p-button type="submit" label="Reset Password" styleClass="w-full" [disabled]="forgotPasswordForm.invalid || isLoading"></p-button>
                            
                            <div class="text-center mt-4">
                                <span class="text-surface-900 dark:text-surface-0">Remember your password?</span>
                                <a routerLink="/auth/login" class="font-medium no-underline ml-2 text-primary cursor-pointer">Sign In</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class ForgotPassword {
    forgotPasswordForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.isLoading = true;
        const email = this.forgotPasswordForm.get('email')?.value;

        this.authService.forgotPassword(email)
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Email Sent',
                        detail: 'Password reset instructions have been sent to your email.'
                    });
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 3000);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Request Failed',
                        detail: error.error?.message || 'An error occurred while processing your request'
                    });
                }
            });
    }
} 