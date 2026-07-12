import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GalleryService } from '../../features/gallery/gallery.service';
import { GalleryItem } from '../../shared/models';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-manage-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-gallery.html',
  styleUrl: './manage-gallery.css'
})
export class ManageGallery implements OnInit {
  private galleryService = inject(GalleryService);

  galleryList = signal<GalleryItem[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  viewMode = signal<ViewMode>('list');
  editingItem = signal<Partial<GalleryItem> | null>(null);

  form: Partial<GalleryItem> = this.emptyForm();

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.isLoading.set(true);
    this.galleryService.getAllAdmin().subscribe({
      next: (res) => {
        this.galleryList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load gallery. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingItem.set(null);
    this.viewMode.set('form');
  }

  openEditForm(item: GalleryItem): void {
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
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        this.errorMessage.set('File size exceeds 50MB limit. Please select a smaller file.');
        setTimeout(() => this.errorMessage.set(null), 5000);
        input.value = '';
        return;
      }
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.isUploading.set(true);
    this.galleryService.uploadImage(file).subscribe({
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
    if (!this.form.title || !this.form.description || !this.form.imageUrl) return;
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.galleryService.update(editing.id!, this.form)
      : this.galleryService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'Gallery item updated!' : 'Gallery item created!');
        this.viewMode.set('list');
        this.loadGallery();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  deleteItem(item: GalleryItem): void {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.galleryService.delete(item.id).subscribe({
      next: () => {
        this.successMessage.set('Deleted successfully.');
        this.loadGallery();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  private emptyForm(): Partial<GalleryItem> {
    return { title: '', description: '', imageUrl: '', category: 'General', isActive: true };
  }
}

