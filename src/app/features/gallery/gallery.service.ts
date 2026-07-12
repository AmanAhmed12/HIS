import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { GalleryItem } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private api: ApiService) {}

  getAll(): Observable<GalleryItem[]> {
    return this.api.get<GalleryItem[]>('/public/gallery');
  }

  getById(id: number): Observable<GalleryItem> {
    return this.api.get<GalleryItem>(`/admin/gallery/${id}`);
  }

  // Admin methods
  getAllAdmin(): Observable<GalleryItem[]> {
    return this.api.get<GalleryItem[]>('/admin/gallery');
  }

  create(gallery: Partial<GalleryItem>): Observable<GalleryItem> {
    return this.api.post<GalleryItem>('/admin/gallery', gallery);
  }

  update(id: number, gallery: Partial<GalleryItem>): Observable<GalleryItem> {
    return this.api.put<GalleryItem>(`/admin/gallery/${id}`, gallery);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/gallery/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<{ url: string }>('/admin/gallery/upload', formData);
  }
}
