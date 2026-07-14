import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../features/news-events/news.service';
import { GalleryService } from '../../features/gallery/gallery.service';
import { AnnouncementService } from '../../features/announcements/announcement.service';
import { ContactService } from '../../features/contact/contact.service';
import { FacilityService } from '../../features/facilities/facility.service';
import { DownloadService } from '../../features/downloads/download.service';
import { AchievementService } from '../../features/achievements/achievement.service';
import { AdmissionsService } from '../../features/landing/admissions/admissions.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  // Statistics data
  stats = {
    news: 0,
    announcements: 0,
    unreadMessages: 0,
    galleryItems: 0,
    facilities: 0,
    downloads: 0,
    achievements: 0,
    admissions: 0
  };

  constructor(
    private newsService: NewsService,
    private galleryService: GalleryService,
    private announcementService: AnnouncementService,
    private contactService: ContactService,
    private facilityService: FacilityService,
    private downloadService: DownloadService,
    private achievementService: AchievementService,
    private admissionsService: AdmissionsService,
    private cdr: ChangeDetectorRef
  ) {}

  // Chart data for CSS-based charts
  monthlyActivity = [
    { label: 'Jan', news: 0, announcements: 1 },
    { label: 'Feb', news: 1, announcements: 0 },
    { label: 'Mar', news: 0, announcements: 1 },
    { label: 'Apr', news: 1, announcements: 0 },
    { label: 'May', news: 0, announcements: 1 },
    { label: 'Jun', news: 2, announcements: 3 }
  ];

  contentDistribution = [
    { label: 'News', value: 2, color: '#0f172a' },
    { label: 'Announcements', value: 3, color: '#fbbf24' },
    { label: 'Messages', value: 5, color: '#22c55e' },
    { label: 'Gallery', value: 2, color: '#3b82f6' },
    { label: 'Facilities', value: 8, color: '#a855f7' },
    { label: 'Downloads', value: 12, color: '#ef4444' },
    { label: 'Achievements', value: 6, color: '#14b8a6' },
    { label: 'Admissions', value: 24, color: '#f97316' }
  ];

  admissionsStatus = [
    { label: 'Approved', value: 12, color: '#22c55e' },
    { label: 'Pending', value: 8, color: '#fbbf24' },
    { label: 'Rejected', value: 4, color: '#ef4444' }
  ];

  getMaxValue(arr: any[]): number {
    return Math.max(...arr.map(item => item.value));
  }

  loading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      news: this.newsService.getAllAdmin(),
      gallery: this.galleryService.getAllAdmin(),
      announcements: this.announcementService.getAll(),
      contact: this.contactService.getAll(),
      facilities: this.facilityService.getAllAdmin(),
      downloads: this.downloadService.getAllAdmin(),
      achievements: this.achievementService.getAllAdmin(),
      admissions: this.admissionsService.getAll()
    }).subscribe({
      next: (data: any) => {
        console.log('Dashboard data loaded:', data);
        
        // Safely extract arrays from potentially paginated responses
        const extractArray = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.content && Array.isArray(res.content)) return res.content;
          if (res._embedded) return Object.values(res._embedded)[0] || [];
          return [];
        };

        const news = extractArray(data.news);
        const announcements = extractArray(data.announcements);
        const contact = extractArray(data.contact);
        const gallery = extractArray(data.gallery);
        const facilities = extractArray(data.facilities);
        const downloads = extractArray(data.downloads);
        const achievements = extractArray(data.achievements);
        const admissions = extractArray(data.admissions);

        this.stats = {
          news: news.length,
          announcements: announcements.length,
          unreadMessages: contact.filter((c: any) => !c.isRead).length,
          galleryItems: gallery.length,
          facilities: facilities.length,
          downloads: downloads.length,
          achievements: achievements.length,
          admissions: admissions.length
        };

        // Update chart data based on actual data
        this.updateChartData({ admissions });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        // Set default values on error and still show dashboard
        this.stats = {
          news: 0,
          announcements: 0,
          unreadMessages: 0,
          galleryItems: 0,
          facilities: 0,
          downloads: 0,
          achievements: 0,
          admissions: 0
        };
        this.updateChartData({});
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateChartData(data: any): void {
    // Update content distribution based on actual counts
    this.contentDistribution = [
      { label: 'News', value: this.stats.news, color: '#0f172a' },
      { label: 'Announcements', value: this.stats.announcements, color: '#fbbf24' },
      { label: 'Messages', value: this.stats.unreadMessages, color: '#22c55e' },
      { label: 'Gallery', value: this.stats.galleryItems, color: '#3b82f6' },
      { label: 'Facilities', value: this.stats.facilities, color: '#a855f7' },
      { label: 'Downloads', value: this.stats.downloads, color: '#ef4444' },
      { label: 'Achievements', value: this.stats.achievements, color: '#14b8a6' },
      { label: 'Admissions', value: this.stats.admissions, color: '#f97316' }
    ];

    // Update admissions status based on actual data
    const admissions = data.admissions || [];
    const approved = admissions.filter((a: any) => a.status === 'approved').length;
    const pending = admissions.filter((a: any) => a.status === 'pending').length;
    const rejected = admissions.filter((a: any) => a.status === 'rejected').length;

    this.admissionsStatus = [
      { label: 'Approved', value: approved, color: '#22c55e' },
      { label: 'Pending', value: pending, color: '#fbbf24' },
      { label: 'Rejected', value: rejected, color: '#ef4444' }
    ];
  }
}
