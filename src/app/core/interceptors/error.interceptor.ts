import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid — log out and redirect to login
        authService.logout();
      } else if (error.status === 403) {
        // Forbidden — token may be expired or user lacks permission
        // If it's an admin API call, clear the stale token and redirect to login
        if (req.url.includes('/api/v1/admin/')) {
          authService.logout();
        } else {
          router.navigate(['/']);
        }
      } else if (error.status === 0) {
        console.error('Network error: Cannot reach the server.');
      }
      const errorMessage = error.error?.message || error.message || 'An unexpected error occurred.';
      return throwError(() => new Error(errorMessage));
    })
  );
};
