// Shared TypeScript models / interfaces for the entire application

export interface SchoolInfo {
  id: number;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

export interface NewsEvent {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  eventDate: string;
  createdAt: string;
  type: 'NEWS' | 'EVENT';
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  isActive: boolean;
  expiresAt: string;
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  isActive: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  year: number;
  imageUrl?: string;
}

export interface Download {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  category: string;
  fileSize?: number;
  isActive: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt?: string;
  isRead?: boolean;
}

export interface AdminUser {
  id?: number;
  username: string;
  email?: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
  expiresIn: number;
}
