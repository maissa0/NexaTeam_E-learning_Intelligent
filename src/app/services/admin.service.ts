import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


export interface QuizDto {
  title: string;
  description: string;
  time: number;
}
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASIC_URL = "http://localhost:8090";  // Declare this as a class property

  constructor(private http: HttpClient) { }

  createQuiz(QuizDto: any): Observable<any> {
    return this.http.post(`${this.BASIC_URL}/api/quiz`, QuizDto);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));  // You can customize how you handle the error here
  }
  getAllQuiz(): Observable<any>{
    return this.http.get(this.BASIC_URL +'/api')
  }
  addQuestionInQuiz(QuestionDto: any): Observable<any>{
    return this.http.post(`${this.BASIC_URL}/api/question`, QuestionDto)
    
  }
  getQuizResults(): Observable<any> {
    return this.http.get(this.BASIC_URL + `/api/quiz-result`);
}
  getQuizQuestion(id:number): Observable<any>{
    return this.http.get(`${this.BASIC_URL}/api/${id}`);
  }
    
}
