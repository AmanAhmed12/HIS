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
  createdAt?: string;
  updatedAt?: string;
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
  imageUrl?: string;
  category?: string;
  achievementDate?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface Admission {
  id?: number;
  studentName: string;
  dateOfBirth?: string;
  gradeApplying?: string;
  previousSchool?: string;
  parentName: string;
  email: string;
  phone: string;
  address?: string;
  specialNeeds?: string;
  message?: string;
  applicationStatus?: string;
  isReviewed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
