import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../features/news-events/news.service';
import { NewsEvent } from '../../shared/models';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-manage-news',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-news.html',
  styleUrl: './manage-news.css'
})
export class ManageNews implements OnInit {
  private newsService = inject(NewsService);

  newsList = signal<NewsEvent[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  viewMode = signal<ViewMode>('list');
  editingItem = signal<Partial<NewsEvent> | null>(null);

  form: Partial<NewsEvent> = this.emptyForm();

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading.set(true);
    this.newsService.getAllAdmin().subscribe({
      next: (res) => {
        this.newsList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load news. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingItem.set(null);
    this.viewMode.set('form');
  }

  openEditForm(item: NewsEvent): void {
    this.form = { ...item };
    this.editingItem.set(item);
    this.viewMode.set('form');
  }

  cancelForm(): void {
    this.viewMode.set('list');
    this.form = this.emptyForm();
    this.editingItem.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB (Cloudinary free plan limit)
      if (file.size > maxSize) {
        this.errorMessage.set('File size exceeds 10MB limit. Please select a smaller file.');
        setTimeout(() => this.errorMessage.set(null), 5000);
        input.value = '';
        return;
      }
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.isUploading.set(true);
    this.newsService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.imageUrl = res.url;
        this.isUploading.set(false);
        this.successMessage.set('Image uploaded successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.errorMessage.set('Failed to upload image');
        this.isUploading.set(false);
      }
    });
  }

  saveForm(): void {
    if (!this.form.title || !this.form.content) return;
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.newsService.update(editing.id!, this.form)
      : this.newsService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'News updated!' : 'News created!');
        this.viewMode.set('list');
        this.loadNews();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  deleteItem(item: NewsEvent): void {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.newsService.delete(item.id).subscribe({
      next: () => {
        this.successMessage.set('Deleted successfully.');
        this.loadNews();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  private emptyForm(): Partial<NewsEvent> {
    return { title: '', slug: '', content: '', type: 'NEWS', eventDate: '', imageUrl: '' };
  }
}
