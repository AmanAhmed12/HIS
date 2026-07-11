import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ContactMessage } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private api: ApiService) {}

  submit(message: ContactMessage): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/public/contact', message);
  }

  // Admin methods
  getAll(): Observable<ContactMessage[]> {
    return this.api.get<ContactMessage[]>('/admin/contact');
  }

  markRead(id: number): Observable<ContactMessage> {
    return this.api.put<ContactMessage>(`/admin/contact/${id}/read`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/contact/${id}`);
  }
}
