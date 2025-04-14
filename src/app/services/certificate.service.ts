import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  uploadCertificate(file: File, fromWhere: string, name?: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fromWhere', fromWhere);
    
    // Add name parameter if provided
    if (name) {
      formData.append('name', name);
    }

    // Get auth token but don't set Content-Type - browser will set it with boundary
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${environment.apiUrl}/api/certs/upload`, formData, {
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserCertificates(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/certs`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getCertificateById(fileId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/certs/${fileId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCertificate(fileId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/certs/${fileId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateCertificateInfo(fileId: string, fromWhere: string): Observable<any> {
    const params = new HttpParams()
      .set('fromWhere', fromWhere);

    return this.http.put(`${environment.apiUrl}/api/certs/${fileId}`, null, {
      params: params,
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getDownloadUrl(fileId: string): string {
    const token = this.authService.getToken();
    return `${environment.apiUrl}/api/certs/${fileId}/download?token=${token}`;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object' && error.error.message) {
        // If the server returns a proper error message object
        errorMessage = error.error.message;
        console.error('Certificate API error:', error.error);
      } else {
        // Standard HTTP error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => error);
  }
} 