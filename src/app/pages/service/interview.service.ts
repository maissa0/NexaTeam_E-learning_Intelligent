import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../models/interview.model';

@Injectable({
  providedIn: 'root' 
})
export class InterviewService {
  private apiUrl = 'http://localhost:8082/interviews'; 

  constructor(private http: HttpClient) {}


  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/getAll`);
  }


  getInterviewById(id: string): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/getById/${id}`);
  }

  createInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(`${this.apiUrl}/create`, interview);
  }


  updateInterview(id: string, interview: Interview): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/update/${id}`, interview);
  }


  deleteInterview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}

export default InterviewService; 
