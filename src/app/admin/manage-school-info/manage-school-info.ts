import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SchoolInfo } from '../../shared/models';

@Component({
  selector: 'app-manage-school-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-school-info.html',
  styleUrl: './manage-school-info.css'
})
export class ManageSchoolInfo implements OnInit {
  private api = inject(ApiService);

  schoolInfoList = signal<SchoolInfo[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  editingItem = signal<SchoolInfo | null>(null);

  form: Partial<SchoolInfo> = {};

  ngOnInit(): void {
    this.loadSchoolInfo();
  }

  loadSchoolInfo(): void {
    this.isLoading.set(true);
    this.api.get<SchoolInfo[]>('/admin/school-info').subscribe({
      next: (res) => {
        this.schoolInfoList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load school information. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  openEditForm(item: SchoolInfo): void {
    this.form = { ...item };
    this.editingItem.set(item);
  }

  cancelForm(): void {
    this.form = {};
    this.editingItem.set(null);
  }

  saveForm(): void {
    if (!this.form.key || !this.form.value) return;
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.api.put<SchoolInfo>(`/admin/school-info/${editing.id}`, this.form)
      : this.api.post<SchoolInfo>('/admin/school-info', this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'Information updated!' : 'Information created!');
        this.cancelForm();
        this.loadSchoolInfo();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  deleteItem(item: SchoolInfo): void {
    if (!confirm(`Delete "${item.key}"?`)) return;
    this.api.delete<void>(`/admin/school-info/${item.id}`).subscribe({
      next: () => {
        this.successMessage.set('Deleted successfully.');
        this.loadSchoolInfo();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  getCategoryItems(category: string): SchoolInfo[] {
    return this.schoolInfoList().filter(item => item.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.schoolInfoList().map(item => item.category));
    return Array.from(categories).sort();
  }

  formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

