import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Facility, Achievement, Download } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class FacilityService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Facility[]> {
    return this.api.get<Facility[]>('/public/facilities');
  }

  getAllAdmin(): Observable<Facility[]> {
    return this.api.get<Facility[]>('/admin/facilities');
  }

  getById(id: number): Observable<Facility> {
    return this.api.get<Facility>(`/admin/facilities/${id}`);
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
}

@Injectable({ providedIn: 'root' })
export class AchievementService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Achievement[]> {
    return this.api.get<Achievement[]>('/public/achievements');
  }

  getAllAdmin(): Observable<Achievement[]> {
    return this.api.get<Achievement[]>('/admin/achievements');
  }

  getById(id: number): Observable<Achievement> {
    return this.api.get<Achievement>(`/admin/achievements/${id}`);
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
}

@Injectable({ providedIn: 'root' })
export class DownloadService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Download[]> {
    return this.api.get<Download[]>('/public/downloads');
  }

  getAllAdmin(): Observable<Download[]> {
    return this.api.get<Download[]>('/admin/downloads');
  }

  getById(id: number): Observable<Download> {
    return this.api.get<Download>(`/admin/downloads/${id}`);
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

  incrementDownloadCount(id: number): Observable<Download> {
    return this.api.post<Download>(`/public/downloads/${id}/download`, {});
  }
}
