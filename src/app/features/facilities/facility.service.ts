import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Facility } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class FacilityService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Facility[]> {
    return this.api.get<Facility[]>('/public/facilities');
  }

  getById(id: number): Observable<Facility> {
    return this.api.get<Facility>(`/admin/facilities/${id}`);
  }

  // Admin methods
  getAllAdmin(): Observable<Facility[]> {
    return this.api.get<Facility[]>('/admin/facilities');
  }

  create(facility: Partial<Facility>): Observable<Facility> {
    return this.api.post<Facility>('/admin/facilities', facility);
  }

  update(id: number, facility: Partial<Facility>): Observable<Facility> {
    return this.api.put<Facility>(`/admin/facilities/${id}`, facility);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/facilities/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<{ url: string }>('/admin/facilities/upload', formData);
  }
}
