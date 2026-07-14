import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly apiTimeout = environment.apiTimeout;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
      return throwError(() => new Error(`Client error: ${error.error.message}`));
    } else {
      // Server-side error
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      return throwError(() => new Error(`Server error: ${error.status} - ${error.message}`));
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }

  get<T>(path: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params, headers: this.getHeaders() }).pipe(
      timeout(this.apiTimeout),
      catchError(this.handleError)
    );
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() }).pipe(
      timeout(this.apiTimeout),
      catchError(this.handleError)
    );
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() }).pipe(
      timeout(this.apiTimeout),
      catchError(this.handleError)
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() }).pipe(
      timeout(this.apiTimeout),
      catchError(this.handleError)
    );
  }

  upload<T>(path: string, formData: FormData): Observable<T> {
    const headers = new HttpHeaders();
    // Don't set Content-Type for FormData - browser will set it with boundary
    return this.http.post<T>(`${this.baseUrl}${path}`, formData, { headers }).pipe(
      timeout(this.apiTimeout),
      catchError(this.handleError)
    );
  }
}
