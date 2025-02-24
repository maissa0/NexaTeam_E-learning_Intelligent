import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateTestComponent } from './create-test/create-test.component';
import { ViewResultsComponent } from './view-results/view-results.component';
import { AddQuestionInQuizComponent } from './add-question-in-quiz/add-question-in-quiz.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';
import { UserdashboardComponent } from './dashboard/userdashboard/userdashboard.component';
import { StartQuizComponent } from './start-quiz/start-quiz.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'create-test', component: CreateTestComponent },
  { path: 'view-results', component: ViewResultsComponent },
  { path: 'add-question/:id', component: AddQuestionInQuizComponent },
  { path: 'view-quiz/:id', component: ViewQuizComponent },
  { path: 'user-dashboard', component: UserdashboardComponent },  
  { path: 'start-quiz/:id', component: StartQuizComponent },


  



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
