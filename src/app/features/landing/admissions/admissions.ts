import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admissions.html',
  styleUrl: './admissions.css'
})
export class Admissions {
  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  form = {
    studentName: '',
    dateOfBirth: '',
    grade: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    previousSchool: '',
    specialNeeds: '',
    message: ''
  };

  onSubmit() {
    if (!this.form.studentName || !this.form.parentName || !this.form.email || !this.form.phone) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Simulate API call - replace with actual service call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitted.set(true);
      this.form = {
        studentName: '',
        dateOfBirth: '',
        grade: '',
        parentName: '',
        email: '',
        phone: '',
        address: '',
        previousSchool: '',
        specialNeeds: '',
        message: ''
      };
    }, 1500);
  }

  resetForm() {
    this.submitted.set(false);
    this.errorMessage.set('');
  }
}
