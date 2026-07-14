import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdmissionsService } from '../../features/landing/admissions/admissions.service';
import { Admission } from '../../shared/models';

@Component({
  selector: 'app-manage-admissions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-admissions.html',
  styleUrl: './manage-admissions.css'
})
export class ManageAdmissions implements OnInit {
  private admissionsService = inject(AdmissionsService);

  admissionList = signal<Admission[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  selectedAdmission = signal<Admission | null>(null);
  filterStatus = signal('ALL');

  ngOnInit(): void {
    this.loadAdmissions();
  }

  loadAdmissions(): void {
    this.isLoading.set(true);
    this.admissionsService.getAll().subscribe({
      next: (res) => {
        this.admissionList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load admissions. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  get filteredAdmissions(): Admission[] {
    if (this.filterStatus() === 'ALL') {
      return this.admissionList();
    }
    return this.admissionList().filter(a => a.applicationStatus === this.filterStatus());
  }

  viewAdmission(admission: Admission): void {
    this.selectedAdmission.set(admission);
  }

  closeAdmission(): void {
    this.selectedAdmission.set(null);
  }

  updateStatus(admission: Admission, status: string): void {
    if (!confirm(`Change application status to ${status}?`)) return;
    
    this.admissionsService.updateStatus(admission.id!, status).subscribe({
      next: () => {
        admission.applicationStatus = status;
        this.successMessage.set(`Application status updated to ${status}`);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  deleteAdmission(admission: Admission): void {
    if (!confirm(`Delete application from "${admission.studentName}"?`)) return;
    this.admissionsService.delete(admission.id!).subscribe({
      next: () => {
        this.successMessage.set('Application deleted successfully.');
        this.selectedAdmission.set(null);
        this.loadAdmissions();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  markAsReviewed(admission: Admission): void {
    this.admissionsService.markAsReviewed(admission.id!).subscribe({
      next: () => {
        admission.isReviewed = true;
        this.successMessage.set('Marked as reviewed');
        setTimeout(() => this.successMessage.set(null), 2000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'PENDING': return 'status-pending';
      default: return 'status-unknown';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
