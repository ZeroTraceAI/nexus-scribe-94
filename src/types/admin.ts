// Admin Panel Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalTools: number;
  activeTools: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  conversionRate: number;
}

export interface AnalyticsData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'tool' | 'page';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views?: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'login' | 'logout';
  entityType: 'post' | 'tool' | 'user' | 'settings';
  entityId: string;
  entityTitle?: string;
  timestamp: Date;
  details?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  responseTime: number;
  errorRate: number;
  lastBackup?: Date;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  enableComments: boolean;
  enableNewsletter: boolean;
  postsPerPage: number;
  enableAnalytics: boolean;
  analyticsId?: string;
  enableSEO: boolean;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  resource: 'posts' | 'tools' | 'users' | 'settings' | 'analytics';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export type DateRange = {
  from: Date;
  to: Date;
};

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  filters?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
