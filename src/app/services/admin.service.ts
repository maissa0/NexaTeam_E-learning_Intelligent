import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Replacing hardcoded API_URL with environment variable
const API_URL = environment.apiUrl + '/api';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${API_URL}/admin/getusers`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/admin/user/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Update user role
  updateUserRole(userId: number, roleName: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('roleName', roleName);
    
    return this.http.put<any>(`${API_URL}/admin/update-role`, null, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Update account lock status
  updateAccountLockStatus(userId: number, lock: boolean): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('lock', lock.toString());
    
    return this.http.put<any>(`${API_URL}/admin/update-lock-status`, null, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Update account expiry status
  updateAccountExpiryStatus(userId: number, expire: boolean): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('expire', expire.toString());
    
    return this.http.put<any>(`${API_URL}/admin/update-expiry-status`, null, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Update account enabled status
  updateAccountEnabledStatus(userId: number, enabled: boolean): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('enabled', enabled.toString());
    
    return this.http.put<any>(`${API_URL}/admin/update-enabled-status`, null, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Update credentials expiry status
  updateCredentialsExpiryStatus(userId: number, expire: boolean): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('expire', expire.toString());
    
    return this.http.put<any>(`${API_URL}/admin/update-credentials-expiry-status`, null, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Update user password
  updatePassword(userId: number, password: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('password', password);
    
    return this.http.put<any>(`${API_URL}/admin/update-password`, null, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Create admin user
  createAdminUser(adminUserData: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/admin/create-admin`, adminUserData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get all roles
  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${API_URL}/admin/roles`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get all company requests
  getCompanyRequests(): Observable<any> {
    return this.http.get<any>(`${API_URL}/companies/admin/pending-requests`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Approve company request
  approveCompanyRequest(requestId: number, reason: string = ''): Observable<any> {
    const body = reason ? { reason } : {};
    return this.http.post<any>(`${API_URL}/companies/admin/approve-request/${requestId}`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Reject company request
  rejectCompanyRequest(requestId: number, reason: string = ''): Observable<any> {
    const body = reason ? { reason } : {};
    return this.http.post<any>(`${API_URL}/companies/admin/reject-request/${requestId}`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get company request details
  getCompanyRequestDetails(requestId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/companies/admin/${requestId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get all registered companies
  getAllCompanies(): Observable<any> {
    return this.http.get<any>(`${API_URL}/companies/admin/all`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get company employees
  getCompanyEmployees(companyId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/companies/admin/${companyId}/employees`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
} 