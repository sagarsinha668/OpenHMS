import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as api from '../services/api';

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'pharmacist' | 'viewer' | 'patient';

interface User {
  name: string;
  email: string;
  roles: UserRole[];
}

interface AuthContextType {
  user: User | null;
  activeRole: UserRole | null;
  isViewer: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    try {
      const savedRole = localStorage.getItem('activeRole') as UserRole;
      if (savedRole) return savedRole;
      const saved = localStorage.getItem('auth_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.roles?.includes('viewer')) return 'admin';
        return u.roles?.[0] || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'doctor': return '/doctor';
      case 'receptionist': return '/receptionist';
      case 'pharmacist': return '/pharmacist';
      case 'viewer': return '/admin';
      default: return '/login';
    }
  };

  const isViewer = Boolean(user?.roles?.includes('viewer'));

  const normalizeUser = (userObj: any, fallbackEmail: string = ''): User => {
    const rawRoles = userObj.roles || userObj.userRoles || [];
    const roles: UserRole[] = (Array.isArray(rawRoles) ? rawRoles : [rawRoles])
      .map((r: any) => String(r).toLowerCase() as UserRole);
    return {
      name: userObj.name || userObj.fullName || 'User',
      email: userObj.email || fallbackEmail,
      roles,
    };
  };

  const initUser = useCallback(async () => {
    try {
      const response = await api.getCurrentUser();
      const userObj = response?.user || response;
      if (userObj) {
        const formattedUser = normalizeUser(userObj);
        setUser(formattedUser);
        localStorage.setItem('auth_user', JSON.stringify(formattedUser));
        
        const savedRole = localStorage.getItem('activeRole') as UserRole;
        if (savedRole && (formattedUser.roles.includes(savedRole) || formattedUser.roles.includes('viewer'))) {
          setActiveRole(savedRole);
        } else if (formattedUser.roles.length > 0) {
          const defaultRole = formattedUser.roles.includes('viewer') ? 'admin' : formattedUser.roles[0];
          setActiveRole(defaultRole);
          localStorage.setItem('activeRole', defaultRole);
        }
      }
    } catch (error) {
      console.warn('Could not fetch session from backend, checking local auth cache:', error);
      const saved = localStorage.getItem('auth_user');
      if (!saved && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup') && !location.pathname.startsWith('/book')) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    initUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    const userObj = response?.user || response;
    const formattedUser = normalizeUser(userObj, email);
    
    setUser(formattedUser);
    localStorage.setItem('auth_user', JSON.stringify(formattedUser));
    
    if (formattedUser.roles.includes('viewer')) {
      setActiveRole('admin');
      localStorage.setItem('activeRole', 'admin');
      navigate('/admin', { replace: true });
    } else if (formattedUser.roles.length > 0) {
      const primaryRole = formattedUser.roles[0];
      setActiveRole(primaryRole);
      localStorage.setItem('activeRole', primaryRole);
      navigate(getDashboardPath(primaryRole), { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem('activeRole');
    localStorage.removeItem('auth_user');
    navigate('/login', { replace: true });
  };

  const switchRole = (role: UserRole) => {
    if (user?.roles.includes(role) || user?.roles.includes('viewer')) {
      setActiveRole(role);
      localStorage.setItem('activeRole', role);
      navigate(getDashboardPath(role));
    }
  };

  return (
    <AuthContext.Provider value={{ user, activeRole, isViewer, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
