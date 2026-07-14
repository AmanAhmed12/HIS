import { Component, inject, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolInfoService } from '../../../core/services/school-info.service';
import { SchoolInfo } from '../../../shared/models';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academics.html',
  styleUrl: './academics.css'
})
export class Academics implements OnInit, AfterViewInit {
  private schoolInfoService = inject(SchoolInfoService);
  private cdr = inject(ChangeDetectorRef);

  schoolInfo: SchoolInfo[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadContent();
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  loadContent(): void {
    this.schoolInfoService.getAll().subscribe({
      next: (data) => {
        this.schoolInfo = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Academics data error:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getSchoolInfoValue(key: string): string {
    const item = this.schoolInfo.find(s => s.key === key);
    return item ? item.value : '';
  }

  getSchoolInfoByCategory(category: string): SchoolInfo[] {
    return this.schoolInfo.filter(s => s.category === category);
  }

  private setupScrollAnimations(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      setTimeout(() => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
      }, 100);
    }
  }
}
