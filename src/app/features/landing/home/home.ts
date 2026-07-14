import { Component, inject, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolInfoService } from '../../../core/services/school-info.service';
import { SchoolInfo } from '../../../shared/models';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  private schoolInfoService = inject(SchoolInfoService);
  private cdr = inject(ChangeDetectorRef);

  schoolInfo: SchoolInfo[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadContent();
  }

  ngAfterViewInit(): void {
    this.setupCounterAnimations();
  }

  loadContent(): void {
    this.schoolInfoService.getAll().subscribe({
      next: (data) => {
        this.schoolInfo = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getSchoolInfoValue(key: string): string {
    const item = this.schoolInfo.find(s => s.key === key);
    return item ? item.value : '';
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - navbarHeight, behavior: 'smooth' });
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
        document.querySelectorAll('.highlight-number').forEach(el => observer.observe(el));
      }, 300);
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
