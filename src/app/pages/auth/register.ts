import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CheckboxModule,
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
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create an Account</div>
                            <span class="text-muted-color font-medium">Sign up to get started</span>
                        </div>

                        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                    <input pInputText id="username" type="text" placeholder="Username" class="w-full" formControlName="username" />
                                    <small *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="text-red-500">
                                        Username is required (3-20 characters)
                                    </small>
                                </div>
                                <div>
                                    <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                    <input pInputText id="email" type="email" placeholder="Email address" class="w-full" formControlName="email" />
                                    <small *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-red-500">
                                        Valid email is required
                                    </small>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label for="firstName" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">First Name</label>
                                    <input pInputText id="firstName" type="text" placeholder="First Name" class="w-full" formControlName="firstName" />
                                </div>
                                <div>
                                    <label for="lastName" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Last Name</label>
                                    <input pInputText id="lastName" type="text" placeholder="Last Name" class="w-full" formControlName="lastName" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label for="password" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Password</label>
                                    <p-password id="password" formControlName="password" [toggleMask]="true" styleClass="w-full" [feedback]="true"></p-password>
                                    <small *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500">
                                        Password is required (min 6 characters)
                                    </small>
                                </div>
                                <div>
                                    <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Confirm Password</label>
                                    <p-password id="confirmPassword" formControlName="confirmPassword" [toggleMask]="true" styleClass="w-full" [feedback]="false"></p-password>
                                    <small *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="text-red-500">
                                        Confirm password is required
                                    </small>
                                    <small *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="text-red-500">
                                        Passwords do not match
                                    </small>
                                </div>
                            </div>

                            <div class="flex items-center mb-4">
                                <p-checkbox formControlName="acceptTerms" [binary]="true" id="acceptTerms" class="mr-2"></p-checkbox>
                                <label for="acceptTerms" class="text-surface-900 dark:text-surface-0">I agree to the terms and conditions</label>
                            </div>
                            <small *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched" class="block text-red-500 mb-4">
                                You must accept the terms and conditions
                            </small>

                            <p-button type="submit" label="Register" styleClass="w-full" [disabled]="registerForm.invalid || isLoading"></p-button>
                            
                            <div class="text-center mt-4">
                                <span class="text-surface-900 dark:text-surface-0">Already have an account?</span>
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
export class Register implements OnInit {
    registerForm!: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            email: ['', [Validators.required, Validators.email]],
            firstName: [''],
            lastName: [''],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
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

    onSubmit(): void {
        if (this.registerForm.invalid) {
            return;
        }

        this.isLoading = true;
        const { username, email, password, firstName, lastName } = this.registerForm.value;

        this.authService.register(username, email, password, firstName, lastName)
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Registration Successful',
                        detail: 'Your account has been created successfully. Please login.'
                    });
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 2000);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Registration Failed',
                        detail: error.error?.message || 'An error occurred during registration'
                    });
                }
            });
    }
} 