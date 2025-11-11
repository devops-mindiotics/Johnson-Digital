
import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Represents a single school associated with a user from the API response
interface School {
  tenantId: string;
  schoolId: string;
  id: string; // Adding id for frontend consistency
  roles: string[];
}

interface User {
    id: string;
    name: string;
    email: string;
    tenantId: string;
    role: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    phone?: string;
    avatarUrl?: string;
    schools: School[]; // User can be associated with multiple schools
}

// Represents the structure of the data object within the API login response
interface LoginData {
    user: Partial<User>;
    schools: any[]; // The schools array from the API
    sessionJwt: string;
    contextJwt: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => void;
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
    
      const login = useCallback((data: LoginData) => {
        const { user: apiUser, schools: apiSchools = [] } = data;

        // The UI component expects school.id, but the API provides school.schoolId.
        // We map it here to ensure compatibility.
        const formattedSchools = apiSchools.map(school => ({
          ...school,
          id: school.schoolId,
        }));

        const userForContext: User = {
          ...apiUser,
          id: apiUser.id!,
          name: `${apiUser.firstName} ${apiUser.lastName}`,
          email: apiUser.email!,
          role: apiUser.roles?.[0] || '',
          // The main tenantId for the user can be taken from their first associated school
          tenantId: formattedSchools[0]?.tenantId || '',
          schools: formattedSchools,
        };
        
        setUser(userForContext);
        localStorage.setItem('educentral-user', JSON.stringify(userForContext));
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
