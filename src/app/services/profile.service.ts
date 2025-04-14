import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8081/api';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<any> {
    return this.authService.uploadProfilePicture(file);
  }

  // Get profile picture URL
  getProfilePictureUrl(): string {
    // Add a cache-busting parameter to ensure the browser doesn't show a cached version
    return `${API_URL}/auth/profile/picture?t=${new Date().getTime()}`;
  }

  // Delete profile picture
  deleteProfilePicture(): Observable<any> {
    return this.http.delete<any>(`${API_URL}/auth/profile/picture`, { headers: this.authService.getAuthHeaders() })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
} 