'use client';

import { type ReactNode, createContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type UserRole = 'Super Admin' | 'School Admin' | 'Teacher' | 'Student';
export interface User {
  name: string;
  role: UserRole;
  profilePic: string;
  mobile: string;
  class?: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('educentral-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (pathname === '/login' || pathname === '/') {
          router.replace('/dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('educentral-user');
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('educentral-user', JSON.stringify(userData));
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('educentral-user');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
