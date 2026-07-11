import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { NewsEvent, PaginatedResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor(private api: ApiService) {}

  getAll(): Observable<NewsEvent[]> {
    return this.api.get<NewsEvent[]>('/public/news');
  }

  getById(id: number): Observable<NewsEvent> {
    return this.api.get<NewsEvent>(`/admin/news/${id}`);
  }

  // Admin methods
  getAllAdmin(): Observable<NewsEvent[]> {
    return this.api.get<NewsEvent[]>('/admin/news');
  }

  create(news: Partial<NewsEvent>): Observable<NewsEvent> {
    return this.api.post<NewsEvent>('/admin/news', news);
  }

  update(id: number, news: Partial<NewsEvent>): Observable<NewsEvent> {
    return this.api.put<NewsEvent>(`/admin/news/${id}`, news);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/news/${id}`);
  }
}
