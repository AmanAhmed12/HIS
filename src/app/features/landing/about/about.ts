import { Component, inject, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolInfoService } from '../../../core/services/school-info.service';
import { SchoolInfo, Achievement, Facility } from '../../../shared/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, AfterViewInit {
  private schoolInfoService = inject(SchoolInfoService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  schoolInfo: SchoolInfo[] = [];
  achievements: Achievement[] = [];
  facilities: Facility[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadContent();
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
  }

  loadContent(): void {
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

    this.http.get<Achievement[]>('http://localhost:8080/api/v1/public/achievements').subscribe({
      next: (data) => {
        this.achievements = data;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Achievements error:', error);
        this.checkLoading();
      }
    });

    this.http.get<Facility[]>('http://localhost:8080/api/v1/public/facilities').subscribe({
      next: (data) => {
        this.facilities = data;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Facilities error:', error);
        this.checkLoading();
      }
    });
  }

  private checkLoading(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  getSchoolInfoValue(key: string): string {
    const item = this.schoolInfo.find(s => s.key === key);
    return item ? item.value : '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

  private setupCounterAnimations(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const counter = entry.target as HTMLElement;
              const target = parseInt(counter.getAttribute('data-target') || '0');
              this.animateCounter(counter, target);
              observer.unobserve(counter);
            }
          });
        },
        { threshold: 0.5 }
      );

      setTimeout(() => {
        const counters = document.querySelectorAll('.highlight-number');
        counters.forEach(el => observer.observe(el));
      }, 100);
    }
  }

  private animateCounter(element: HTMLElement, target: number): void {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + (target === 100 ? '%' : '+');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
      }
    }, 16);
  }
}
