import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { ProfileComponent } from '../component/profile/profile.component';
import { LoginComponent } from '../component/auth/login/login.component';
import { RegisterComponent } from '../component/auth/register/register.component';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';
import { COMPANY_ROUTES } from './company/company.routes';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { USER_ROUTES } from '../component/userandemployee/user.routes';
import { AuthGuard } from '../services/auth.guard';
import { ForgotPasswordComponent } from '../component/auth/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from '../component/auth/resetpassword/resetpassword.component';

export default [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', children: DASHBOARD_ROUTES },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'profile', component: ProfileComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'company', children: COMPANY_ROUTES },
    { path: 'forgotpassword', component: ForgotPasswordComponent },
    { path: 'password-reset', component: ResetPasswordComponent },
    { 
      path: 'admin', 
      children: ADMIN_ROUTES,
      // Commenting out the auth guard to allow access without admin role
      // canActivate: [AuthGuard],
      // data: { roles: ['ROLE_ADMIN'] }
    },
    { 
      path: 'user', 
      children: USER_ROUTES,
      // Add auth guard if needed
      // canActivate: [AuthGuard],
      // data: { roles: ['ROLE_USER', 'ROLE_TEACHER', 'ROLE_EMPLOYEE'] }
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
