import { Component, signal, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from './contact.service';
import { SchoolInfoService } from '../../../core/services/school-info.service';
import { ContactMessage } from '../../../shared/models';
import { SchoolInfo } from '../../../shared/models';

interface FormErrors {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  private contactService = inject(ContactService);
  private schoolInfoService = inject(SchoolInfoService);
  private cdr = inject(ChangeDetectorRef);

  form: ContactMessage = { name: '', email: '', phone: '', subject: '', message: '' };
  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);
  formErrors = signal<FormErrors>({ name: '', email: '', message: '' });

  schoolInfo: SchoolInfo[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.schoolInfoService.getAll().subscribe({
      next: (data) => {
        this.schoolInfo = data;
        this.checkLoading();
      },
      error: (error) => {
        console.error('School info error:', error);
        this.checkLoading();
      }
    });
  }

  private checkLoading(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  validateForm(): boolean {
    const errors: FormErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!this.form.name || this.form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.form.email || !emailRegex.test(this.form.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!this.form.message || this.form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    this.formErrors.set(errors);
    return isValid;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.formErrors.set({ name: '', email: '', message: '' });

    this.contactService.submit(this.form).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
        this.form = { name: '', email: '', phone: '', subject: '', message: '' };
        setTimeout(() => this.submitted.set(false), 5000);
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Failed to send message. Please try again.');
      }
    });
  }

  onFieldChange(field: keyof FormErrors): void {
    const currentErrors = this.formErrors();
    if (currentErrors[field]) {
      this.formErrors.set({ ...currentErrors, [field]: '' });
    }
  }

  getSchoolInfoValue(key: string): string {
    const item = this.schoolInfo.find(s => s.key === key);
    return item ? item.value : '';
  }
}