import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FacilityService } from '../../features/facilities/facility.service';
import { Facility } from '../../shared/models';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-manage-facilities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-facilities.html',
  styleUrl: './manage-facilities.css'
})
export class ManageFacilities implements OnInit {
  private facilityService = inject(FacilityService);

  facilityList = signal<Facility[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  viewMode = signal<ViewMode>('list');
  editingItem = signal<Partial<Facility> | null>(null);

  form: Partial<Facility> = this.emptyForm();

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.isLoading.set(true);
    this.facilityService.getAllAdmin().subscribe({
      next: (res) => {
        this.facilityList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load facilities. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingItem.set(null);
    this.viewMode.set('form');
  }

  openEditForm(item: Facility): void {
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
    this.facilityService.uploadImage(file).subscribe({
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
    if (!this.form.name || !this.form.description) return;
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.facilityService.update(editing.id!, this.form)
      : this.facilityService.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'Facility updated!' : 'Facility created!');
        this.viewMode.set('list');
        this.loadFacilities();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  deleteItem(item: Facility): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.facilityService.delete(item.id).subscribe({
      next: () => {
        this.successMessage.set('Deleted successfully.');
        this.loadFacilities();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  private emptyForm(): Partial<Facility> {
    return { name: '', description: '', imageUrl: '', icon: '', isActive: true };
  }
}

