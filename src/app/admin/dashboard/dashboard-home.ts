import { Component, OnInit } from '@angular/core';
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
    private admissionsService: AdmissionsService
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
      next: (data) => {
        console.log('Dashboard data loaded:', data);
        this.stats = {
          news: data.news?.length || 0,
          announcements: data.announcements?.length || 0,
          unreadMessages: data.contact?.filter((c: any) => !c.isRead).length || 0,
          galleryItems: data.gallery?.length || 0,
          facilities: data.facilities?.length || 0,
          downloads: data.downloads?.length || 0,
          achievements: data.achievements?.length || 0,
          admissions: data.admissions?.length || 0
        };

        // Update chart data based on actual data
        this.updateChartData(data);
        this.loading = false;
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
