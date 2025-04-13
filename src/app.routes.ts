import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { HeaderFrontOfComponent } from './app/front_office/header-front-of/header-front-of.component';
import { FooterFrontOfComponent } from './app/front_office/footer-front-of/footer-front-of.component';
import { ViewQuizComponent } from './app/pages/uikit/view-quiz.component';
import { CreateTestComponent } from './app/pages/uikit/create-test.component';
import { AddQuestionInQuizComponent } from './app/pages/uikit/add-question-in-quiz.component';
import { UpdateQuizComponent } from './app/pages/uikit/update-quiz.component';
import { StartQuizComponent } from './app/pages/landing/components/start-quiz.component';
import { UserDashboardComponent } from './app/pages/landing/components/user-dashboard.component';
import { ViewResultsComponent } from './app/pages/landing/components/view-results.component';
import { GeneratedQuizComponent } from './app/pages/uikit/generated-quiz.component';
import { SubscriptionComponent } from './app/pages/uikit/SubscriptionComponent ';

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
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'view/:id', component: ViewQuizComponent },
    { path: 'create-test', component: CreateTestComponent },
{ path: 'add-question/:id', component: AddQuestionInQuizComponent },
{ path: 'update-quiz/:id', component: UpdateQuizComponent },
{ path: 'start-quiz/:id', component: StartQuizComponent }, // Route avec paramètre ID
{ path: 'user-dashboard', component: UserDashboardComponent },
{ path: 'view-results', component: ViewResultsComponent },
{ path: 'generated-quiz', component: GeneratedQuizComponent },
// Définissez la route




    { path: '**', redirectTo: '/notfound' }
];
