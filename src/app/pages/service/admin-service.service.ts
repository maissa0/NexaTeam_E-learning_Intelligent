import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';


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


  private apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';  // URL pour obtenir des questions trivia

  generateQuizFromAPI(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      delay(1000)  // Ajoutez un délai de 1 seconde entre les requêtes
    ).pipe(
      tap(data => {
        console.log('Quiz généré:', data); // Log les données
      }),
      catchError(error => {
        if (error.status === 429) {
          console.error('Trop de requêtes, réessayez plus tard');
          setTimeout(() => {
            this.generateQuizFromAPI();  // Réessayer après un délai
          }, 60000);  // Réessayer après 60 secondes
        } else {
          console.error('Erreur lors du chargement du quiz!', error);
        }
        // Renvoyer une valeur par défaut en cas d'erreur ou une erreur gérée
        return throwError(error);
      })
    );
  }
  

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
  updateQuiz(id: number, QuizDto: QuizDto): Observable<any> {
    return this.http.put(`${this.BASIC_URL}/api/quiz/${id}`, QuizDto);
  }
  
  deleteQuiz(id: number): Observable<any> {
    return this.http.delete(`${this.BASIC_URL}/api/quiz/${id}`);
  }}
