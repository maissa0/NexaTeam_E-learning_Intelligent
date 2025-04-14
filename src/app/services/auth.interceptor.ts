import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // Skip adding token for public endpoints
    if (request.url.includes('/public/')) {
      return next.handle(request).pipe(
        catchError(this.handleError.bind(this))
      );
    }
    
    // Clone the request and add the token if it exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // If 401 Unauthorized, redirect to login
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
    }
    return throwError(() => error);
  }
} 