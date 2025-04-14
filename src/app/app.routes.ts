import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { ForgotPassword } from './pages/auth/forgot-password';
import { ForgotPasswordComponent } from './component/auth/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './component/auth/resetpassword/resetpassword.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    // Direct access to forgot password page (Sakai UI version)
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    // Direct access to legacy forgot password component
    {
        path: 'password-reset',
        component: ForgotPasswordComponent 
    },
    {
        path: 'forgotpassword', // Adding a simpler route as an alternative
        component: ForgotPasswordComponent
    },
    // Direct access to reset password component
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes')
    },
    {
        path: '',
        loadChildren: () => import('./pages/pages.routes'),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/auth/error'
    }
];
