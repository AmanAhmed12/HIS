import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { GalleryItem } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private api: ApiService) {}

  getAll(category?: string): Observable<GalleryItem[]> {
    return this.api.get<GalleryItem[]>('/public/gallery');
  }

  // Admin methods
  getAllAdmin(): Observable<GalleryItem[]> {
    return this.api.get<GalleryItem[]>('/admin/gallery');
  }

  create(item: Partial<GalleryItem>): Observable<GalleryItem> {
    return this.api.post<GalleryItem>('/admin/gallery', item);
  }

  update(id: number, item: Partial<GalleryItem>): Observable<GalleryItem> {
    return this.api.put<GalleryItem>(`/admin/gallery/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/gallery/${id}`);
  }
}
