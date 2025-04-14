import { Routes } from '@angular/router';
import { CompanyRegisterComponent } from '../../component/company/register/register.component';
import { CompanyDashboardComponent } from '../../component/company/dashboard/dashboard.component';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    component: CompanyDashboardComponent,
    title: 'Company Dashboard'
  },
  {
    path: 'register',
    component: CompanyRegisterComponent,
    title: 'Register Company'
  }
]; 