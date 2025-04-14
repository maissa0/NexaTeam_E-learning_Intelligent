import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Register } from './register';
import { ForgotPassword } from './forgot-password';
import { ResetPassword } from './reset-password';
import { VerifyTwoFactor } from './verify-two-factor';
import { AuthGuard } from '../../services/auth.guard';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'password-reset', component: ForgotPassword },
    { path: 'forgot', component: ForgotPassword },
    { path: 'reset-password', component: ResetPassword },
    { path: 'verify-two-factor', component: VerifyTwoFactor }
] as Routes;
