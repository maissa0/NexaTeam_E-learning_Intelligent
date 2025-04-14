import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:8081/api';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/public/signin`, { username, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Debug log
          
          // Ensure we have a token in the response
          if (!response.jwtToken) {
            console.error('No JWT token in response');
            return;
          }
          
          // Store user details and jwt token in local storage to keep user logged in
          this.storeUserData(response);
          this.currentUserSubject.next(response);
          
          // Check if 2FA is enabled
          if (response.is2faEnabled) {
            // Don't redirect if 2FA is enabled
            return response;
          }
          
          // If 2FA is not enabled, redirect to profile page
          this.router.navigate(['/pages/profile']);
        }),
        catchError(error => {
          console.error('Login error:', error); // Debug log
          return throwError(() => error);
        })
      );
  }

  verify2FA(code: number, jwtToken: string): Observable<any> {
    const params = new HttpParams()
      .set('code', code.toString())
      .set('jwtToken', jwtToken);
    
    return this.http.post<any>(`${API_URL}/auth/public/verify-2fa-login`, null, { params })
      .pipe(
        tap(response => {
          if (response.success) {
            // After successful 2FA verification, redirect to profile page
            this.router.navigate(['/pages/profile']);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(username: string, email: string, password: string, firstName?: string, lastName?: string): Observable<any> {
    // Build the signup request body to match the backend's SignupRequest
    const signUpRequest = {
      username,
      email,
      password,
      firstName,
      lastName
    };

    return this.http.post<any>(`${API_URL}/auth/public/signup`, signUpRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post<any>(`${API_URL}/auth/public/forgot-password`, null, { params })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);
    
    return this.http.post<any>(`${API_URL}/auth/public/reset-password`, null, { params })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('currentPassword', currentPassword)
      .set('newPassword', newPassword);
    
    return this.http.post<any>(`${API_URL}/auth/change-password`, null, { 
      headers, 
      params 
    }).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => error);
      })
    );
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${API_URL}/auth/profile`, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getDetailedUserProfile(): Observable<any> {
    console.log('Requesting detailed user profile');
    const token = this.getToken();
    console.log('Token when requesting profile:', token ? 'Token exists' : 'No token');
    
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${API_URL}/auth/profile/detailed`, { headers })
      .pipe(
        tap(response => {
          console.log('Profile data received:', response);
        }),
        catchError(error => {
          console.error('Error getting detailed profile:', error);
          if (error.status === 401) {
            console.error('Authentication error - invalid or missing token');
            this.router.navigate(['/auth/login']);
          }
          return throwError(() => error);
        })
      );
  }

  updateProfile(profileData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${API_URL}/auth/profile`, profileData, { headers })
      .pipe(
        tap(response => {
          // Update stored user data
          const currentUser = this.getUserFromStorage();
          if (currentUser) {
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  uploadProfilePicture(file: File): Observable<any> {
    const headers = this.getAuthHeaders();
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<any>(`${API_URL}/auth/profile/picture`, formData, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getProfilePicture(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${API_URL}/auth/profile/picture`, { 
      headers,
      responseType: 'blob' 
    }).pipe(
      map(blob => {
        return URL.createObjectURL(blob);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  enable2FA(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${API_URL}/auth/enable-2fa`, null, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  verify2FASetup(code: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('code', code.toString());
    return this.http.post<any>(`${API_URL}/auth/verify-2fa`, null, { params, headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  disable2FA(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${API_URL}/auth/disable-2fa`, null, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  get2FAStatus(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${API_URL}/auth/user/2fa-status`, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    // Get token directly from localStorage for more reliability
    return localStorage.getItem('token');
  }

  private storeUserData(userData: any): void {
    console.log('Storing user data:', userData); // Debug log
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Make sure we explicitly set the token in localStorage
    if (userData.jwtToken) {
      localStorage.setItem('token', userData.jwtToken);
      console.log('Token stored in localStorage:', userData.jwtToken); // Debug log
    } else {
      console.error('No JWT token to store in localStorage');
    }
    
    // Set auto logout if token has expiration
    // Assuming token expiration is 1 hour (3600000 ms)
    this.autoLogout(3600000);
  }

  getUserFromStorage(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Redirects to profile page if the user is authenticated
   * Use this to ensure consistent navigation after authentication
   */
  redirectToProfilePage(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/pages/profile']);
    }
  }

  getBasicUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${API_URL}/auth/profile`, { headers })
      .pipe(
        map(response => {
          // Extract only the needed fields
          return {
            username: response.username,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            profilePictureUrl: response.profilePicture ? 
              `${API_URL}/profile/picture` : 
              null // Return null if no profile picture exists
          };
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Returns the current token from localStorage.
   * This is useful for debugging authentication issues.
   */
  getAuthStatus(): any {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    
    return {
      isAuthenticated: !!token,
      token: token,
      currentUser: currentUser ? JSON.parse(currentUser) : null
    };
  }

  /**
   * Get the authentication headers with JWT token
   * This can be used by other services to make authenticated requests
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}