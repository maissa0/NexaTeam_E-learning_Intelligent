import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private baseUrl = 'http://localhost:8084/api/favorites';
  private URL = 'http://localhost:8084/api/offersDisponibles';

  constructor(private http: HttpClient) {}

  addToFavorites(userId: string, jobOfferId: string): Observable<any> {
    if (!userId || !jobOfferId) {
      throw new Error('userId and jobOfferId are required');
    }
    const params = new HttpParams()
      .set('userId', userId)
      .set('jobOfferId', jobOfferId);
    return this.http.post(`${this.baseUrl}/add`, null, { params });
  }

  // Add this new method
  isFavorite(userId: string, jobOfferId: string): Observable<boolean> {
    return this.getFavorites(userId).pipe(
      map(favorites => favorites.some((fav: any) => fav.jobOfferId === jobOfferId))
    );
  }

  removeFromFavorites(userId: string, jobOfferId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('jobOfferId', jobOfferId);
    return this.http.delete(`${this.baseUrl}/remove`, { params });
  }

  getFavorites(userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get(`${this.baseUrl}/user`, { params });
  }
  getOfferDetails(id: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.URL}/${id}`);
  }
}