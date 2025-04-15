import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:9090/api/feedbacks';

  constructor(private http: HttpClient) {}

  getFeedbacksByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`);
  }
  createFeedback(feedback: { feedbackText: string; userId: number; courseId: number; }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, feedback);
  }
  toggleLike(feedbackId: number, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${feedbackId}/like/${userId}`, {});
  }
  getAverageEmotionForCourse(courseId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${courseId}/average-emotion`);
  }
  getGroupedFeedbacks(): Observable<{ [courseId: number]: { [courseTitle: string]: any[] } }> {
    return this.http.get<{ [courseId: number]: { [courseTitle: string]: any[] } }>(`${this.apiUrl}/groupedByCourse`);
  }
  deleteFeedback(feedbackId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${feedbackId}`);
  }
}
