import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Settings, Notification, DashboardStats } from '@/types/admin';

interface AdminContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  settings: Settings | null;
  notifications: Notification[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data for demonstration
const mockUser: User = {
  id: '1',
  email: 'admin@codesec.ai',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
  lastLogin: new Date(),
  isActive: true,
};

const mockSettings: Settings = {
  siteName: 'CodeSec AI',
  siteDescription: 'Your trusted source for cybersecurity and AI tools',
  siteUrl: 'https://codesec.ai',
  enableComments: true,
  enableNewsletter: true,
  postsPerPage: 10,
  enableAnalytics: true,
  enableSEO: true,
  socialLinks: {
    twitter: 'https://twitter.com/codesecai',
    github: 'https://github.com/codesecai',
    linkedin: 'https://linkedin.com/company/codesecai',
  },
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Feature Available',
    message: 'Dark mode has been added to the admin panel.',
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    type: 'warning',
    title: 'Backup Required',
    message: 'Your last backup was 7 days ago. Consider running a backup.',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load settings
    const storedSettings = localStorage.getItem('admin_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      setSettings(mockSettings);
    }

    // Load notifications
    setNotifications(mockNotifications);
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo (replace with real auth in production)
      if (email && password.length >= 6) {
        setUser(mockUser);
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('admin_user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedSettings = { ...settings, ...newSettings } as Settings;
      setSettings(updatedSettings);
      localStorage.setItem('admin_settings', JSON.stringify(updatedSettings));
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const refreshStats = async () => {
    // This would typically fetch fresh data from an API
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        settings,
        notifications,
        login,
        logout,
        updateSettings,
        markNotificationAsRead,
        clearNotifications,
        refreshStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
