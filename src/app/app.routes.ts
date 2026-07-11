import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar').then(m => m.Navbar),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // Admin routes (protected)
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () => import('./admin/auth/admin-login').then(m => m.AdminLogin)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.AdminDashboard),
        children: [
          {
            path: '',
            loadComponent: () => import('./admin/dashboard/dashboard-home').then(m => m.DashboardHome)
          },
          {
            path: 'news',
            loadComponent: () => import('./admin/manage-news/manage-news').then(m => m.ManageNews)
          },
          {
            path: 'gallery',
            loadComponent: () => import('./admin/manage-gallery/manage-gallery').then(m => m.ManageGallery)
          },
          {
            path: 'announcements',
            loadComponent: () => import('./admin/manage-announcements/manage-announcements').then(m => m.ManageAnnouncements)
          },
          {
            path: 'school-info',
            loadComponent: () => import('./admin/manage-school-info/manage-school-info').then(m => m.ManageSchoolInfo)
          },
          {
            path: 'facilities',
            loadComponent: () => import('./admin/manage-facilities/manage-facilities').then(m => m.ManageFacilities)
          },
          {
            path: 'downloads',
            loadComponent: () => import('./admin/manage-downloads/manage-downloads').then(m => m.ManageDownloads)
          },
          {
            path: 'achievements',
            loadComponent: () => import('./admin/manage-achievements/manage-achievements').then(m => m.ManageAchievements)
          },
          {
            path: 'contact',
            loadComponent: () => import('./admin/manage-contact/manage-contact').then(m => m.ManageContact)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Catch-all
  {
    path: '**',
    redirectTo: ''
  }
];
