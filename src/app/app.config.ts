import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Define the interceptor function
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  console.log(`Interceptor: URL=${req.url}, Token exists=${!!token}`);
  
  // Skip adding token for public endpoints
  if (req.url.includes('/public/')) {
    console.log('Interceptor: Skipping token for public endpoint');
    return next(req);
  }
  
  // For non-public endpoints, always add the token if it exists
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor: Added token to request headers');
    return next(modifiedReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // If 401 Unauthorized, redirect to login
          console.error('Authentication error:', error);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  } else {
    // No token available for authenticated request
    console.warn('Interceptor: No token available for authenticated request');
    
    // For endpoints requiring authentication, we could redirect to login
    // Uncomment the following line if you want to redirect immediately
    // router.navigate(['/auth/login']);
  }
  
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // If 401 Unauthorized, redirect to login
        console.error('Authentication error:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations()
  ]
};
