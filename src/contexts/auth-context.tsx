import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    tenantId: string;
    schoolId: string;
    classId?: string;
    sectionId?: string;
    role: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    phone?: string;
    avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: { user: User }) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
        try {
          const storedUser = localStorage.getItem('educentral-user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('educentral-user');
        } finally {
          setIsLoading(false);
        }
      }, []);
    
      const login = useCallback((data: { user: User }) => {
        const { user } = data;
        setUser(user);
        localStorage.setItem('educentral-user', JSON.stringify(user));
        router.push('/homepage');
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
