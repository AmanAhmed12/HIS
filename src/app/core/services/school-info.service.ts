import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { SchoolInfo } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class SchoolInfoService {
  constructor(private api: ApiService) {}

  getByKey(key: string): Observable<SchoolInfo> {
    return this.api.get<SchoolInfo>(`/public/school-info/key/${key}`);
  }

  getAll(): Observable<SchoolInfo[]> {
    return this.api.get<SchoolInfo[]>('/public/school-info');
  }

  getByCategory(category: string): Observable<SchoolInfo[]> {
    return this.api.get<SchoolInfo[]>(`/public/school-info/category/${category}`);
  }

  // Admin methods
  getAllAdmin(): Observable<SchoolInfo[]> {
    return this.api.get<SchoolInfo[]>('/admin/school-info');
  }

  create(schoolInfo: Partial<SchoolInfo>): Observable<SchoolInfo> {
    return this.api.post<SchoolInfo>('/admin/school-info', schoolInfo);
  }

  update(id: number, schoolInfo: Partial<SchoolInfo>): Observable<SchoolInfo> {
    return this.api.put<SchoolInfo>(`/admin/school-info/${id}`, schoolInfo);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/school-info/${id}`);
  }
}
