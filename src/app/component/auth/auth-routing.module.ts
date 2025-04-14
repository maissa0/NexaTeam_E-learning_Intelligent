import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./resetpassword/resetpassword.module').then(m => m.ResetPasswordModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { } 