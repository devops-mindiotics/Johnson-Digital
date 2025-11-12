
import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Represents a single school associated with a user from the API response
interface School {
  tenantId: string;
  schoolId: string;
  id: string; // Adding id for frontend consistency
  roles: string[];
}

// Represents a tenant role from the API response
interface TenantRole {
    tenantId: string;
    roles: string[];
}

interface User {
    id: string;
    name: string;
    email: string;
    tenantId: string;
    schoolId?: string; // schoolId is optional but should be present for school-level users
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
    tenantRoles?: TenantRole[];
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
        const { user: apiUser, schools: apiSchools = [], tenantRoles = [], sessionJwt, contextJwt } = data;

        // --- Simplified and Direct Logic ---
        // We will derive the school and tenant ID directly from the schools array, which is a reliable source.
        const primarySchoolId = apiSchools[0]?.schoolId;
        const primaryTenantId = apiSchools[0]?.tenantId;

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
          tenantId: primaryTenantId,
          schoolId: primarySchoolId, // Assigning the schoolId directly here
          schools: formattedSchools,
        };

        // --- Logging for Verification ---
        console.log("AuthContext: Storing user object with schoolId:", userForContext.schoolId, userForContext);

        const contextInfo = {
            tenantId: primaryTenantId,
            schoolId: primarySchoolId,
        };
        
        // Set state and all required items in localStorage
        setUser(userForContext);
        localStorage.setItem('educentral-user', JSON.stringify(userForContext));
        localStorage.setItem('contextInfo', JSON.stringify(contextInfo));
        localStorage.setItem('sessionJWT', sessionJwt);
        localStorage.setItem('contextJWT', contextJwt);
        
        router.push('/homepage');
      }, [router]);
    
      const logout = useCallback(() => {
        setUser(null);
        // Clear all session-related items from localStorage for a clean logout
        localStorage.removeItem('educentral-user');
        localStorage.removeItem('contextInfo');
        localStorage.removeItem('sessionJWT');
        localStorage.removeItem('contextJWT');
        localStorage.removeItem('roles');
        router.push('/login');
      }, [router]);
    
      return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
          {children}
        </AuthContext.Provider>
      );
    }
