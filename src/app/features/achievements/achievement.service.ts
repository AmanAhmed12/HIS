import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Achievement } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AchievementService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Achievement[]> {
    return this.api.get<Achievement[]>('/public/achievements');
  }

  getById(id: number): Observable<Achievement> {
    return this.api.get<Achievement>(`/admin/achievements/${id}`);
  }

  // Admin methods
  getAllAdmin(): Observable<Achievement[]> {
    return this.api.get<Achievement[]>('/admin/achievements');
  }

  create(achievement: Partial<Achievement>): Observable<Achievement> {
    return this.api.post<Achievement>('/admin/achievements', achievement);
  }

  update(id: number, achievement: Partial<Achievement>): Observable<Achievement> {
    return this.api.put<Achievement>(`/admin/achievements/${id}`, achievement);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/achievements/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<{ url: string }>('/admin/achievements/upload', formData);
  }
}
