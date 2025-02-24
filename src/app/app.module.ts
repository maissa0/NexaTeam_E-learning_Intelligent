import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateTestComponent } from './create-test/create-test.component';
import { ViewResultsComponent } from './view-results/view-results.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AddQuestionInQuizComponent } from './add-question-in-quiz/add-question-in-quiz.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';
import { UserdashboardComponent } from './dashboard/userdashboard/userdashboard.component';
import { StartQuizComponent } from './start-quiz/start-quiz.component';
import { UpdateQuizComponent } from './update-quiz/update-quiz.component';



registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateTestComponent,
    ViewResultsComponent,
    AddQuestionInQuizComponent,
    ViewQuizComponent,
    UserdashboardComponent,
    StartQuizComponent,
    UpdateQuizComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
