import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-verify-two-factor',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
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
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Two-Factor Authentication</div>
                            <span class="text-muted-color font-medium">Enter the verification code from your authenticator app</span>
                        </div>

                        <form [formGroup]="twoFactorForm" (ngSubmit)="onSubmit()">
                            <div class="mb-6">
                                <label for="code" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Verification Code</label>
                                <p-inputNumber id="code" formControlName="code" [useGrouping]="false" [min]="0" [max]="999999" placeholder="Enter 6-digit code" class="w-full"></p-inputNumber>
                                <small *ngIf="twoFactorForm.get('code')?.invalid && twoFactorForm.get('code')?.touched" class="text-red-500">
                                    Valid 6-digit code is required
                                </small>
                            </div>

                            <p-button type="submit" label="Verify" styleClass="w-full" [disabled]="twoFactorForm.invalid || isLoading"></p-button>
                            
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
export class VerifyTwoFactor implements OnInit {
    twoFactorForm!: FormGroup;
    jwtToken: string = '';
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.twoFactorForm = this.fb.group({
            code: ['', [Validators.required, Validators.min(0), Validators.max(999999)]]
        });

        // Get token from query params
        this.route.queryParams.subscribe(params => {
            this.jwtToken = params['token'];
            if (!this.jwtToken) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Request',
                    detail: 'Authentication token is missing'
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);
            }
        });
    }

    onSubmit(): void {
        if (this.twoFactorForm.invalid || !this.jwtToken) {
            return;
        }

        this.isLoading = true;
        const code = this.twoFactorForm.get('code')?.value;

        this.authService.verify2FA(code, this.jwtToken)
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Verification Successful',
                        detail: 'Two-factor authentication verified successfully.'
                    });
                    
                    // Store the token in localStorage
                    localStorage.setItem('token', this.jwtToken);
                    
                    // Get user info
                    this.authService.getUserProfile().subscribe(userProfile => {
                        // Store user info
                        const userData = {
                            jwtToken: this.jwtToken,
                            username: userProfile.user.userName,
                            roles: userProfile.user.role ? [userProfile.user.role.roleName] : ['ROLE_USER']
                        };
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                        
                        setTimeout(() => {
                            this.router.navigate(['/']);
                        }, 1000);
                    });
                },
                error: (error) => {
                    this.isLoading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Verification Failed',
                        detail: error.error?.message || 'Invalid verification code'
                    });
                }
            });
    }
} 