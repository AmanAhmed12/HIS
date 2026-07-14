import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './news.service';
import { NewsEvent } from '../../shared/models';

@Component({
  selector: 'app-news-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-events.html',
  styleUrl: './news-events.css'
})
export class NewsEvents implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  newsItems: NewsEvent[] = [];
  events: NewsEvent[] = [];
  loading = true;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.newsService.getAll().subscribe({
      next: (response: any) => {
        // Handle both direct array or ApiResponse wrapper
        let data: NewsEvent[] = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && response.data) {
          data = response.data;
        } else if (response && response.content) {
          data = response.content;
        }

        // Filter by type from the single 'news' table
        this.newsItems = data.filter((item: NewsEvent) => item.type === 'NEWS');
        this.events   = data.filter((item: NewsEvent) => item.type === 'EVENT');
        this.loading  = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load news/events:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getMonth(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  getDay(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).getDate().toString().padStart(2, '0');
  }
}
