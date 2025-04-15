import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommondationService {
  private apiUrl = 'http://localhost:9090/api/recommandations';

  constructor(private http: HttpClient) {}
  getRecommendedCourses(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommendations/${id}`);
  }
  getMyCourses(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommend/${id}`);
  }
  addEngagement(userId: number, courseId: number, engagement: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('courseId', courseId)
      .set('engagement', engagement);

    return this.http.post<any>(`${this.apiUrl}/`, {}, { params });
  }
}
