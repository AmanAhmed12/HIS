import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnouncementService } from '../../features/announcements/announcement.service';
import { Announcement } from '../../shared/models';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-manage-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-announcements.html',
  styleUrl: './manage-announcements.css'
})
export class ManageAnnouncements implements OnInit {
  private announcementService = inject(AnnouncementService);

  announcementList = signal<Announcement[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  viewMode = signal<ViewMode>('list');
  editingItem = signal<Partial<Announcement> | null>(null);

  form: Partial<Announcement> = this.emptyForm();

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading.set(true);
    this.announcementService.getAll().subscribe({
      next: (res) => {
        this.announcementList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load announcements. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingItem.set(null);
    this.viewMode.set('form');
  }

  openEditForm(item: Announcement): void {
    this.form = { ...item };
    this.editingItem.set(item);
    this.viewMode.set('form');
  }

  cancelForm(): void {
    this.viewMode.set('list');
    this.form = this.emptyForm();
    this.editingItem.set(null);
  }

  saveForm(): void {
    if (!this.form.title || !this.form.content) return;
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.announcementService.update(editing.id!, this.form)
      : this.announcementService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'Announcement updated!' : 'Announcement created!');
        this.viewMode.set('list');
        this.loadAnnouncements();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  deleteItem(item: Announcement): void {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.announcementService.delete(item.id).subscribe({
      next: () => {
        this.successMessage.set('Deleted successfully.');
        this.loadAnnouncements();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  private emptyForm(): Partial<Announcement> {
    return { title: '', content: '', priority: 'NORMAL', isActive: true };
  }

  getBadgeClass(priority: string): string {
    switch (priority) {
      case 'URGENT': return 'urgent';
      case 'IMPORTANT': return 'info';
      default: return 'success';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

