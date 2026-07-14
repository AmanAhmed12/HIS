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
  showAddForm = signal(false);

  form: Partial<SchoolInfo> = {};

  // Section keys - organized by landing page sections
  categoryKeys: Record<string, string[]> = {
    home: [
      'home_subtitle', 'home_title', 'home_description',
      'feature_1_icon', 'feature_1_title', 'feature_1_text',
      'feature_2_icon', 'feature_2_title', 'feature_2_text',
      'feature_3_icon', 'feature_3_title', 'feature_3_text'
    ],
    about: [
      'about_subtitle', 'about_title', 'about_description', 'about_vision', 'about_mission'
    ],
    academics: [
      'academics_subtitle', 'academics_title', 'academics_description',
      'program_1_icon', 'program_1_title', 'program_1_grade', 'program_1_description', 'program_1_features',
      'program_2_icon', 'program_2_title', 'program_2_grade', 'program_2_description', 'program_2_features',
      'program_3_icon', 'program_3_title', 'program_3_grade', 'program_3_description', 'program_3_features',
      'approach_1_number', 'approach_1_title', 'approach_1_description',
      'approach_2_number', 'approach_2_title', 'approach_2_description',
      'approach_3_number', 'approach_3_title', 'approach_3_description',
      'approach_4_number', 'approach_4_title', 'approach_4_description'
    ],
    contact: [
      'contact_subtitle', 'contact_title', 'contact_description', 
      'contact_address', 'contact_phone1', 'contact_phone2', 'contact_email'
    ],
    admissions: [
      'admissions_subtitle', 'admissions_title', 'admissions_description',
      'req_1_icon', 'req_1_title', 'req_1_description',
      'req_2_icon', 'req_2_title', 'req_2_description',
      'req_3_icon', 'req_3_title', 'req_3_description',
      'req_4_icon', 'req_4_title', 'req_4_description',
      'req_5_icon', 'req_5_title', 'req_5_description',
      'req_6_icon', 'req_6_title', 'req_6_description',
      'timeline_1_date', 'timeline_1_title', 'timeline_1_description',
      'timeline_2_date', 'timeline_2_title', 'timeline_2_description',
      'timeline_3_date', 'timeline_3_title', 'timeline_3_description',
      'timeline_4_date', 'timeline_4_title', 'timeline_4_description'
    ]
  };

  ngOnInit(): void {
    this.loadSchoolInfo();
  }

  loadSchoolInfo(): void {
    this.isLoading.set(true);
    this.api.get<SchoolInfo[]>('/admin/school-info').subscribe({
      next: (res) => {
        console.log('Admin loaded school info:', res);
        console.log('Categories in database:', [...new Set(res.map(item => item.category))]);
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
    this.showAddForm.set(false);
  }

  openAddForm(section: string): void {
    this.form = {};
    this.editingItem.set(null);
    this.showAddForm.set(true);
  }

  openAddFormWithKey(section: string, key: string): void {
    this.form = { key };
    this.editingItem.set(null);
    this.showAddForm.set(true);
  }

  cancelForm(): void {
    this.form = {};
    this.editingItem.set(null);
    this.showAddForm.set(false);
  }

  saveForm(): void {
    if (!this.form.key || !this.form.value) return;
    console.log('Saving school info:', this.form);
    this.isSaving.set(true);
    const editing = this.editingItem();

    const request = editing
      ? this.api.put<SchoolInfo>(`/admin/school-info/${editing.id}`, this.form)
      : this.api.post<SchoolInfo>('/admin/school-info', this.form);

    request.subscribe({
      next: (res) => {
        console.log('Save successful:', res);
        this.isSaving.set(false);
        this.successMessage.set(editing ? 'Information updated!' : 'Information created!');
        this.cancelForm();
        this.loadSchoolInfo();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => {
        console.error('Save failed:', err);
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

  getSectionItems(section: string): SchoolInfo[] {
    return this.schoolInfoList().filter(item => item.category === section);
  }

  getCategoryItems(category: string): SchoolInfo[] {
    return this.schoolInfoList().filter(item => item.category === category);
  }

  getSections(): string[] {
    return Object.keys(this.categoryKeys).sort();
  }

  getCategories(): string[] {
    const categories = [...new Set(this.schoolInfoList().map(item => item.category))];
    return categories.sort();
  }

  getMissingKeys(section: string): string[] {
    const existingKeys = this.getSectionItems(section).map(item => item.key);
    const expectedKeys = this.categoryKeys[section] || [];
    return expectedKeys.filter((key: string) => !existingKeys.includes(key));
  }

  formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

