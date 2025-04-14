import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser) {
      // Check if route has data.roles and user doesn't have required role
      if (route.data['roles'] && !this.checkRoles(currentUser.roles, route.data['roles'])) {
        // Role not authorized, redirect to home page
        this.router.navigate(['/profile']);
        return false;
      }
      
      // Authorized, return true
      return true;
    }

    // Not logged in, redirect to login page with return url
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  private checkRoles(userRoles: string[], requiredRoles: string[]): boolean {
    return userRoles.some(role => requiredRoles.includes(role));
  }
} 