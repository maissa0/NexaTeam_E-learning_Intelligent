import { Routes } from '@angular/router';
import { UserHomeComponent } from './user-home.component';
import { ResumeBuilderComponent } from './resume-builder.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: UserHomeComponent,
        title: 'User Home'
      },
      {
        path: 'resume-builder',
        component: ResumeBuilderComponent,
        title: 'Resume Builder'
      }
    ]
  }
]; 