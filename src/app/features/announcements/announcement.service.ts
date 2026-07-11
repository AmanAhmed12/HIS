import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Announcement } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  constructor(private api: ApiService) {}

  getActive(): Observable<Announcement[]> {
    return this.api.get<Announcement[]>('/public/announcements');
  }

  // Admin methods
  getAll(): Observable<Announcement[]> {
    return this.api.get<Announcement[]>('/admin/announcements');
  }

  getById(id: number): Observable<Announcement> {
    return this.api.get<Announcement>(`/admin/announcements/${id}`);
  }

  create(announcement: Partial<Announcement>): Observable<Announcement> {
    return this.api.post<Announcement>('/admin/announcements', announcement);
  }

  update(id: number, announcement: Partial<Announcement>): Observable<Announcement> {
    return this.api.put<Announcement>(`/admin/announcements/${id}`, announcement);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/announcements/${id}`);
  }
}
