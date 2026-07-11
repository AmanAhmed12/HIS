import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthResponse, LoginRequest, AdminUser } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'his_admin_token';
  private readonly USER_KEY = 'his_admin_user';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private api = inject(ApiService);
  private router = inject(Router);

  currentUser = signal<AdminUser | null>(this.getStoredUser());
  isAuthenticated = signal<boolean>(!!this.getToken());

  login(credentials: LoginRequest): Observable<any> {
    return this.api.post<any>('/auth/login', credentials).pipe(
      tap((response) => {
        this.setToken(response.token);
        const user: AdminUser = {
          id: 1,
          username: response.username || credentials.username,
          email: '',
          role: 'ADMIN'
        };
        this.setUser(user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (this.isBrowser) localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: AdminUser): void {
    if (this.isBrowser) localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): AdminUser | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
