import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Download } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Download[]> {
    return this.api.get<Download[]>('/public/downloads');
  }

  getById(id: number): Observable<Download> {
    return this.api.get<Download>(`/admin/downloads/${id}`);
  }

  // Admin methods
  getAllAdmin(): Observable<Download[]> {
    return this.api.get<Download[]>('/admin/downloads');
  }

  create(download: Partial<Download>): Observable<Download> {
    return this.api.post<Download>('/admin/downloads', download);
  }

  update(id: number, download: Partial<Download>): Observable<Download> {
    return this.api.put<Download>(`/admin/downloads/${id}`, download);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/downloads/${id}`);
  }
}
