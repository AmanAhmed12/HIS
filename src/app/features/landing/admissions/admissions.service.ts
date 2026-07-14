import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Admission } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AdmissionsService {
  constructor(private api: ApiService) {}

  submit(admission: Admission): Observable<Admission> {
    return this.api.post<Admission>('/public/admissions', admission);
  }

  // Admin methods
  getAll(): Observable<Admission[]> {
    return this.api.get<Admission[]>('/admin/admissions');
  }

  getPending(): Observable<Admission[]> {
    return this.api.get<Admission[]>('/admin/admissions/pending');
  }

  getUnreviewed(): Observable<Admission[]> {
    return this.api.get<Admission[]>('/admin/admissions/unreviewed');
  }

  getById(id: number): Observable<Admission> {
    return this.api.get<Admission>(`/admin/admissions/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Admission> {
    return this.api.put<Admission>(`/admin/admissions/${id}/status`, status);
  }

  markAsReviewed(id: number): Observable<Admission> {
    return this.api.put<Admission>(`/admin/admissions/${id}/reviewed`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/admissions/${id}`);
  }
}
