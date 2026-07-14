import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { SchoolInfoService } from '../../../core/services/school-info.service';
import { AdmissionsService } from './admissions.service';
import { SchoolInfo, Admission } from '../../../shared/models';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admissions.html',
  styleUrl: './admissions.css'
})
export class Admissions implements OnInit {
  private schoolInfoService = inject(SchoolInfoService);
  private admissionsService = inject(AdmissionsService);
  private cdr = inject(ChangeDetectorRef);

  schoolInfo: SchoolInfo[] = [];
  loading = true;

  form: Admission = {
    studentName: '',
    dateOfBirth: '',
    gradeApplying: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    previousSchool: '',
    specialNeeds: '',
    message: ''
  };

  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.schoolInfoService.getAll().subscribe({
      next: (data) => {
        this.schoolInfo = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admissions data error:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getSchoolInfoValue(key: string): string {
    const item = this.schoolInfo.find(s => s.key === key);
    return item ? item.value : '';
  }

  onSubmit() {
    if (!this.form.studentName || !this.form.parentName || !this.form.email || !this.form.phone) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.admissionsService.submit(this.form).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
        this.form = {
          studentName: '',
          dateOfBirth: '',
          gradeApplying: '',
          parentName: '',
          email: '',
          phone: '',
          address: '',
          previousSchool: '',
          specialNeeds: '',
          message: ''
        };
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Failed to submit application. Please try again.');
      }
    });
  }

  resetForm() {
    this.submitted.set(false);
    this.errorMessage.set('');
  }

  scrollToForm() {
    const element = document.getElementById('application-form');
    if (element) {
      const navbarHeight = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToRequirements() {
    const element = document.getElementById('requirements');
    if (element) {
      const navbarHeight = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
