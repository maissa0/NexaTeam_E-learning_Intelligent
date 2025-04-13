import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Quiz } from '../Models/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {

  private BASIC_URL = "http://localhost:8090";

  constructor(private http: HttpClient) { }
  getAllQuiz(): Observable<any>{
      return this.http.get(this.BASIC_URL +'/api')
    }
    getQuizQuestion(id:number): Observable<any>{
      return this.http.get(`${this.BASIC_URL}/api/${id}`);
    }
    submitQuiz(data:any): Observable<any>{
      return this.http.post(this.BASIC_URL +'/api/submit-quiz', data);
    }
    getQuizById(id: number): Observable<Quiz> {
      return this.http.get<Quiz>(`${this.BASIC_URL}/api/${id}`);
    }
  
    
    
    
  }

