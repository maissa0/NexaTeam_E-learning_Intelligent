import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AddchapterComponent } from './app/addchapter/addchapter.component';
import { HeaderFrontOfComponent } from './app/front_office/header-front-of/header-front-of.component';
import { FooterFrontOfComponent } from './app/front_office/footer-front-of/footer-front-of.component';
import { AddcourseComponent } from './app/addcourse/addcourse.component';
import { LoginComponent } from './app/auth/login/login.component';
import { RegistrationComponent } from './app/registration/registration.component';
import { ProfessordashboardComponent } from './app/professordashboard/professordashboard.component';
import { CourselistComponent } from './app/courselist/courselist.component';
import { MycoursesComponent } from './app/mycourses/mycourses.component';
import { MywishlistComponent } from './app/mywishlist/mywishlist.component';
import { UserlistComponent } from './app/userlist/userlist.component';
import { UserprofileComponent } from './app/userprofile/userprofile.component';
import { AddprofessorComponent } from './app/addprofessor/addprofessor.component';
import { ProfessorlistComponent } from './app/professorlist/professorlist.component';
import { ApprovalstatusComponent } from './app/approvalstatus/approvalstatus.component';
import { ProfessorprofileComponent } from './app/professorprofile/professorprofile.component';
import { FullcourseComponent } from './app/fullcourse/fullcourse.component';
import { RegistrationsuccessComponent } from './app/registrationsuccess/registrationsuccess.component';
import { AdmindashboardComponent } from './app/admindashboard/admindashboard.component';
import { UserdashboardComponent } from './app/userdashboard/userdashboard.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path :'header', component : HeaderFrontOfComponent},
    {path: 'footer', component : FooterFrontOfComponent},
    { path: 'landing', component: Landing },
    { path: 'add-chapter', component: AddchapterComponent },
    { path: 'add-course', component: AddcourseComponent },
    { path: 'course-list', component: AddcourseComponent },
    { path: 'log', component: LoginComponent },
    { path: 'reg', component: RegistrationComponent },
    {path:'registration',component:RegistrationComponent},
    {path:'registrationsuccess',component:RegistrationsuccessComponent},
    {path:'admindashboard',component:AdmindashboardComponent},
    {path:'userdashboard',component:UserdashboardComponent},
    {path:'professordashboard',component:ProfessordashboardComponent,},
    {path:'addProfessor',component:AddprofessorComponent},
  {path:'addCourse',component:AddcourseComponent},
  {path:'approveprofessor',component:ApprovalstatusComponent},
  {path:'professorlist',component:ProfessorlistComponent},
  {path:'userlist',component:UserlistComponent},
  {path:'courselist',component:CourselistComponent},
  {path:'addchapter',component:AddchapterComponent},
  {path:'fullcourse/:coursename',component:FullcourseComponent},
  {path:'editprofessorprofile',component:ProfessorprofileComponent,},
  {path:'edituserprofile',component:UserprofileComponent},
  {path:'mywishlist',component:MywishlistComponent},
  {path:'mycourses',component:MycoursesComponent},
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
