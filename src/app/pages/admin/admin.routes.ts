import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../component/admin/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    title: 'Admin Dashboard'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
]; 