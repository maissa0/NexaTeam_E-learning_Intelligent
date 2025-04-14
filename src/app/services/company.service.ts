import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Use API URL from environment
const API_URL = environment.apiUrl;

// For backend API responses
interface UserResponse {
  userId?: number;
  id?: number;
  userName?: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: any;
  company?: any;
}

interface CompanyRegistrationRequest {
  name: string;
  address: string;
  logo: string;
  emailCompany: string;
  description: string;
}

interface CompanyResponse {
  id: number;
  name: string;
  address: string;
  logo: string;
  emailCompany: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface FileUploadResponse {
  fileUrl: string;
}

interface Employee {
  id: number;
  username?: string;
  userName?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  hireDate?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${API_URL}/api/companies`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Register a new company
  registerCompany(company: CompanyRegistrationRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, company, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Upload company logo
  uploadLogo(formData: FormData): Observable<FileUploadResponse> {
    // For now, use a mock implementation since we don't have a specific logo upload endpoint
    // In a real application, you would implement this properly
    return new Observable<FileUploadResponse>(observer => {
      // Read the file from the FormData
      const file = formData.get('file') as File;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // Return the data URL as the logo URL (base64 encoded)
          const base64String = reader.result as string;
          observer.next({ fileUrl: base64String });
          observer.complete();
        };
        reader.onerror = (error) => {
          observer.error(error);
        };
        reader.readAsDataURL(file);
      } else {
        observer.error(new Error('No file provided'));
      }
    });
  }

  // Get company details
  getCompanyDetails(id: number): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.apiUrl}/${id}`);
  }

  // Update company details
  updateCompany(id: number, company: Partial<CompanyRegistrationRequest>): Observable<CompanyResponse> {
    return this.http.put<CompanyResponse>(`${this.apiUrl}/${id}`, company);
  }

  // Delete company
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Public endpoint for company registration (no auth required)
  registerCompanyPublic(companyData: CompanyRegistrationRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/public/register`, companyData)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Admin endpoints
  getPendingRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/pending-requests`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  approveRequest(requestId: number, reason?: string): Observable<any> {
    const body = reason ? { reason } : {};
    return this.http.post<any>(`${this.apiUrl}/admin/approve-request/${requestId}`, body)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  rejectRequest(requestId: number, reason?: string): Observable<any> {
    const body = reason ? { reason } : {};
    return this.http.post<any>(`${this.apiUrl}/admin/reject-request/${requestId}`, body)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getAllCompanies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getCompanyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Employee management
  getEmployees(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${API_URL}/api/company/employees`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching company employees:', error);
        return throwError(() => error);
      })
    );
  }
  
  getEmployee(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_URL}/api/company/employees/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching employee details:', error);
        return throwError(() => error);
      })
    );
  }
  
  createEmployee(employee: Omit<Employee, 'id'>): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_URL}/api/company/employees`, employee, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error creating employee:', error);
        return throwError(() => error);
      })
    );
  }
  
  // Add employee using the company endpoint
  addEmployee(employeeDTO: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }): Observable<any> {
    return this.http.post<any>(`${API_URL}/api/company/employees/add`, employeeDTO, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error adding employee:', error);
        return throwError(() => error);
      })
    );
  }
  
  updateEmployee(id: number, employee: Partial<Employee>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${API_URL}/api/company/employees/${id}`, employee, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error updating employee:', error);
        return throwError(() => error);
      })
    );
  }
  
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/api/company/employees/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error deleting employee:', error);
        return throwError(() => error);
      })
    );
  }
} 