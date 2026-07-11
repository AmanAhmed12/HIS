import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './downloads.html',
  styleUrl: './downloads.css'
})
export class Downloads {
  downloadCategories: any[] = [];
  hasLoaded = false;

  loadDownloads() {
    if (this.hasLoaded) return;
    this.hasLoaded = true;

    // Mock data - will be replaced with API calls
    this.downloadCategories = [
      {
        category: 'Admission Forms',
        icon: '📝',
        files: [
          { name: 'Application Form 2024-2025', type: 'PDF', size: '2.5 MB', url: '#' },
          { name: 'Medical Form', type: 'PDF', size: '1.2 MB', url: '#' },
          { name: 'Parent Declaration', type: 'PDF', size: '0.8 MB', url: '#' }
        ]
      },
      {
        category: 'Academic Resources',
        icon: '📚',
        files: [
          { name: 'Student Handbook 2024', type: 'PDF', size: '5.3 MB', url: '#' },
          { name: 'Curriculum Guide - Primary', type: 'PDF', size: '3.1 MB', url: '#' },
          { name: 'Curriculum Guide - Secondary', type: 'PDF', size: '3.8 MB', url: '#' },
          { name: 'Assessment Policy', type: 'PDF', size: '1.5 MB', url: '#' }
        ]
      },
      {
        category: 'School Policies',
        icon: '📋',
        files: [
          { name: 'Code of Conduct', type: 'PDF', size: '1.8 MB', url: '#' },
          { name: 'Attendance Policy', type: 'PDF', size: '0.9 MB', url: '#' },
          { name: 'Anti-Bullying Policy', type: 'PDF', size: '1.1 MB', url: '#' },
          { name: 'Health & Safety Policy', type: 'PDF', size: '2.2 MB', url: '#' }
        ]
      },
      {
        category: 'Fee Structure',
        icon: '💰',
        files: [
          { name: 'Fee Schedule 2024-2025', type: 'PDF', size: '0.5 MB', url: '#' },
          { name: 'Payment Guidelines', type: 'PDF', size: '0.7 MB', url: '#' }
        ]
      },
      {
        category: 'Calendar & Schedule',
        icon: '📅',
        files: [
          { name: 'Academic Calendar 2024-2025', type: 'PDF', size: '1.2 MB', url: '#' },
          { name: 'Exam Schedule', type: 'PDF', size: '0.8 MB', url: '#' },
          { name: 'Holiday Schedule', type: 'PDF', size: '0.4 MB', url: '#' }
        ]
      }
    ];
  }

  downloadFile(file: any) {
    // Will be implemented with actual download logic
    console.log('Downloading:', file.name);
  }
}
