
import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Represents the class details for a student
interface ClassDetails {
  sectionName: string;
  classId: string;
  academicYear: string;
  rollNumber: string;
  className: string;
  sectionId: string;
}

// Represents a single school associated with a user from the API response
interface School {
  tenantId: string;
  schoolId: string;
  id: string; // Adding id for frontend consistency
  roles: string[];
  classDetails?: ClassDetails; // Optional class details for students
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
    classDetails?: ClassDetails; // Optional class details for students
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
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log("AuthProvider: Loaded user from localStorage", parsedUser);
          }
        } catch (error) {
          console.error('AuthProvider: Failed to parse user from localStorage', error);
          localStorage.removeItem('educentral-user');
        } finally {
          setIsLoading(false);
        }
      }, []);
    
      const login = useCallback((data: LoginData) => {
        console.log("AuthProvider: Login process started with data:", data);
        const { user: apiUser, schools: apiSchools = [], tenantRoles = [], sessionJwt, contextJwt } = data;

        let primaryTenantId: string | undefined;
        let primarySchoolId: string | undefined;
        let classDetails: ClassDetails | undefined;

        // Determine tenantId based on user role
        if (tenantRoles && tenantRoles.length > 0) {
            primaryTenantId = tenantRoles[0].tenantId;
            console.log("AuthProvider: Tenant ID derived from tenantRoles:", primaryTenantId);
        } else if (apiSchools && apiSchools.length > 0) {
            primaryTenantId = apiSchools[0].tenantId;
            primarySchoolId = apiSchools[0].schoolId;
            classDetails = apiSchools[0].classDetails;
            console.log("AuthProvider: Tenant ID and School ID derived from schools array:", primaryTenantId, primarySchoolId);
        } else {
            console.error("AuthProvider Error: Cannot determine tenantId from login response.", data);
            // Handle cases where tenantId cannot be determined. Maybe logout or show an error.
            return; 
        }

        if (!primaryTenantId) {
            console.error("AuthProvider FATAL: Tenant ID is undefined. Aborting login.", data);
            return;
        }

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
          schoolId: primarySchoolId,
          schools: formattedSchools,
          classDetails: classDetails,
        };

        console.log("AuthProvider: Final user object for context:", userForContext);

        const contextInfo = {
            tenantId: primaryTenantId,
            schoolId: primarySchoolId,
            classDetails: classDetails,
        };
        
        console.log("AuthProvider: Storing contextInfo in localStorage:", contextInfo);
        
        setUser(userForContext);
        localStorage.setItem('educentral-user', JSON.stringify(userForContext));
        localStorage.setItem('contextInfo', JSON.stringify(contextInfo));
        localStorage.setItem('sessionJWT', sessionJwt);
        localStorage.setItem('contextJWT', contextJwt);
        
        router.push('/homepage');
      }, [router]);
    
      const logout = useCallback(() => {
        setUser(null);
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
