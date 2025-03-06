import { HttpClient } from '@angular/common/http';
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
}
