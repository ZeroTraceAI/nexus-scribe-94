import { useState, useEffect } from 'react';
import type { DashboardStats, AnalyticsData, ActivityLog, PaginatedResponse, ContentItem, User } from '@/types/admin';

// Mock data generators
const generateMockStats = (): DashboardStats => ({
  totalUsers: 1247,
  activeUsers: 892,
  totalPosts: 156,
  publishedPosts: 142,
  totalTools: 24,
  activeTools: 22,
  pageViews: 45678,
  bounceRate: 32.5,
  avgSessionDuration: '4m 32s',
  conversionRate: 3.8,
});

const generateMockAnalytics = (days: number): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      pageViews: Math.floor(Math.random() * 5000) + 1000,
      uniqueVisitors: Math.floor(Math.random() * 3000) + 500,
      sessions: Math.floor(Math.random() * 4000) + 800,
      bounceRate: Math.floor(Math.random() * 30) + 25,
      avgSessionDuration: Math.floor(Math.random() * 300) + 120,
    });
  }
  
  return data;
};

const generateMockActivities = (count: number): ActivityLog[] => {
  const actions: ActivityLog['action'][] = ['create', 'update', 'delete', 'publish', 'login'];
  const entityTypes: ActivityLog['entityType'][] = ['post', 'tool', 'user', 'settings'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i}`,
    userId: `user-${Math.floor(Math.random() * 10)}`,
    userName: ['Admin User', 'Editor One', 'Editor Two'][Math.floor(Math.random() * 3)],
    action: actions[Math.floor(Math.random() * actions.length)],
    entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
    entityId: `entity-${i}`,
    entityTitle: `Content Item ${i}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)),
    details: 'Sample activity details',
  }));
};

const generateMockContent = (count: number, type: 'post' | 'tool'): ContentItem[] => {
  const statuses: ContentItem['status'][] = ['draft', 'published', 'archived'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${type}-${i}`,
    title: `${type === 'post' ? 'Blog Post' : 'Tool'} ${i + 1}`,
    type,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    author: ['Admin User', 'Editor One', 'Editor Two'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 30)),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)),
    views: Math.floor(Math.random() * 10000),
  }));
};

const generateMockUsers = (count: number): User[] => {
  const roles: User['role'][] = ['admin', 'editor', 'viewer'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i}`,
    email: `user${i}@example.com`,
    name: [`User ${i + 1}`, `Editor ${i}`, `Viewer ${i}`][Math.floor(Math.random() * 3)],
    role: roles[Math.floor(Math.random() * roles.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 365)),
    lastLogin: Math.random() > 0.2 ? new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)) : undefined,
    isActive: Math.random() > 0.1,
  }));
};

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStats(generateMockStats());
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async (days: number = 30) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(generateMockAnalytics(days));
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadAnalytics(30);
  }, []);

  return { stats, analytics, isLoading, error, refreshStats: loadStats, refreshAnalytics: loadAnalytics };
}

export function useContent(type: 'post' | 'tool') {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockData = generateMockContent(50, type);
      setContent(mockData);
      setTotal(mockData.length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [type]);

  return { content, isLoading, total, refresh: loadContent };
}

export function useActivities() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActivities(generateMockActivities(20));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return { activities, isLoading, refresh: loadActivities };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockData = generateMockUsers(100);
      setUsers(mockData);
      setTotal(mockData.length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, isLoading, total, refresh: loadUsers };
}
