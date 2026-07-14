import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryItem } from '../../../shared/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  gallery: GalleryItem[] = [];
  loading = true;
  selectedCategory: string = 'all';

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.http.get<GalleryItem[]>('http://localhost:8080/api/v1/public/gallery').subscribe({
      next: (data) => {
        this.gallery = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Gallery error:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredGallery(): GalleryItem[] {
    if (this.selectedCategory === 'all') {
      return this.gallery;
    }
    return this.gallery.filter(item => item.category === this.selectedCategory);
  }

  getCategories(): string[] {
    const categories = [...new Set(this.gallery.map(item => item.category))];
    return ['all', ...categories];
  }
}
