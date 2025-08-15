import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hospital_admin' | 'hospital_staff' | 'blood_bank_staff' | 'donor' | 'analyst';
  orgId?: string;
  orgName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('bloodlink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    // Simulation mode - create demo users
    const demoUsers: Record<string, User> = {
      'hospital@demo.com': {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'hospital@demo.com',
        role: 'hospital_staff',
        orgId: 'hospital_1',
        orgName: 'City General Hospital'
      },
      'donor@demo.com': {
        id: '2',
        name: 'John Smith',
        email: 'donor@demo.com',
        role: 'donor'
      },
      'admin@demo.com': {
        id: '3',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin'
      }
    };

    const demoUser = demoUsers[email];
    if (demoUser && password === 'demo123') {
      setUser(demoUser);
      localStorage.setItem('bloodlink_user', JSON.stringify(demoUser));
      return;
    }

    // If no demo user, create a new one based on email domain
    if (email.includes('hospital')) {
      const newUser: User = {
        id: Math.random().toString(36),
        name: email.split('@')[0],
        email,
        role: 'hospital_staff',
        orgId: 'hospital_demo',
        orgName: 'Demo Hospital'
      };
      setUser(newUser);
      localStorage.setItem('bloodlink_user', JSON.stringify(newUser));
    } else {
      const newUser: User = {
        id: Math.random().toString(36),
        name: email.split('@')[0],
        email,
        role: 'donor'
      };
      setUser(newUser);
      localStorage.setItem('bloodlink_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodlink_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}