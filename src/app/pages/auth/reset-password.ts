import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
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
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Reset Password</div>
                            <span class="text-muted-color font-medium">Enter your new password</span>
                        </div>

                        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
                            <div class="mb-4">
                                <label for="password" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">New Password</label>
                                <p-password id="password" formControlName="password" [toggleMask]="true" styleClass="w-full" [feedback]="true"></p-password>
                                <small *ngIf="resetPasswordForm.get('password')?.invalid && resetPasswordForm.get('password')?.touched" class="text-red-500">
                                    Password is required (min 6 characters)
                                </small>
                            </div>

                            <div class="mb-6">
                                <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Confirm Password</label>
                                <p-password id="confirmPassword" formControlName="confirmPassword" [toggleMask]="true" styleClass="w-full" [feedback]="false"></p-password>
                                <small *ngIf="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched" class="text-red-500">
                                    Confirm password is required
                                </small>
                                <small *ngIf="resetPasswordForm.errors?.['passwordMismatch'] && resetPasswordForm.get('confirmPassword')?.touched" class="text-red-500">
                                    Passwords do not match
                                </small>
                            </div>

                            <p-button type="submit" label="Reset Password" styleClass="w-full" [disabled]="resetPasswordForm.invalid || isLoading"></p-button>
                            
                            <div class="text-center mt-4">
                                <a routerLink="/auth/login" class="font-medium no-underline text-primary cursor-pointer">Back to Login</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class ResetPassword implements OnInit {
    resetPasswordForm!: FormGroup;
    token: string = '';
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: this.passwordMatchValidator
        });

        // Get token from query params
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            if (!this.token) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Request',
                    detail: 'Password reset token is missing'
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/forgot-password']);
                }, 2000);
            }
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

    onSubmit(): void {
        if (this.resetPasswordForm.invalid || !this.token) {
            return;
        }

        this.isLoading = true;
        const newPassword = this.resetPasswordForm.get('password')?.value;

        this.authService.resetPassword(this.token, newPassword)
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password Reset',
                        detail: 'Your password has been reset successfully. Please login with your new password.'
                    });
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 2000);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Reset Failed',
                        detail: error.error?.message || 'An error occurred while resetting your password'
                    });
                }
            });
    }
} 