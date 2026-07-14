import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DownloadService } from '../../features/downloads/download.service';
import { Download } from '../../shared/models';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-manage-downloads',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-downloads.html',
  styleUrl: './manage-downloads.css'
})
export class ManageDownloads implements OnInit {
  private downloadService = inject(DownloadService);

  downloadList = signal<Download[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  viewMode = signal<ViewMode>('list');
  editingItem = signal<Partial<Download> | null>(null);

  form: Partial<Download> = this.emptyForm();

  ngOnInit(): void {
    this.loadDownloads();
  }

  loadDownloads(): void {
    this.isLoading.set(true);
    this.downloadService.getAllAdmin().subscribe({
      next: (res) => {
        this.downloadList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load downloads. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingItem.set(null);
    this.viewMode.set('form');
  }

  openEditForm(item: Download): void {
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
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.isUploading.set(true);
    this.downloadService.uploadFile(file).subscribe({
      next: (res) => {
        this.form.fileUrl = res.url;
        this.form.fileSize = file.size;
        this.isUploading.set(false);
        this.successMessage.set('File uploaded successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.errorMessage.set('Failed to upload file');
        this.isUploading.set(false);
      }
    });
  }

  saveForm(): void {
    if (!this.form.title || !this.form.fileUrl) return;
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.downloadService.update(editing.id!, this.form)
      : this.downloadService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'Download updated!' : 'Download created!');
        this.viewMode.set('list');
        this.loadDownloads();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  deleteItem(item: Download): void {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.downloadService.delete(item.id).subscribe({
      next: () => {
        this.successMessage.set('Deleted successfully.');
        this.loadDownloads();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  }

  getFileIcon(fileType: string): string {
    const icons: { [key: string]: string } = {
      'PDF': '📄',
      'DOC': '📝',
      'XLS': '📊',
      'ZIP': '📦',
      'IMAGE': '🖼️',
      'OTHER': '📁'
    };
    return icons[fileType] || '📁';
  }

  private emptyForm(): Partial<Download> {
    return { title: '', description: '', fileUrl: '', fileType: 'PDF', category: 'General', isActive: true };
  }
}

