import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:8081/api';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  constructor(private http: HttpClient) { }

  // Get all audit logs
  getAllAuditLogs(): Observable<any> {
    return this.http.get<any>(`${API_URL}/audit`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Get audit logs for a specific certification
  getAuditLogsForCertification(certId: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/audit/cert/${certId}`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
} 