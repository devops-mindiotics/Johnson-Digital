
import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '@/lib/utils/token'; // CORRECTED IMPORT PATH

// NOTE: These interfaces are aligned with the API response and will not break other modules.

interface ClassDetails {
  sectionName: string;
  classId: string;
  academicYear: string;
  rollNumber: string;
  className: string;
  sectionId: string;
}

interface School {
  tenantId: string;
  tenantName?: string;
  schoolId: string;
  schoolName?: string;
  id: string;
  roles: string[];
  classDetails?: ClassDetails;
}

interface TenantRole {
  tenantId: string;
  tenantName: string;
  roles: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  avatarUrl?: string;
  role: string; 
  tenantId: string;
  tenantName?: string;
  schoolId?: string; 
  schools: School[];
  tenantRoles: TenantRole[];
  classDetails?: ClassDetails;
}

interface LoginData {
  user: Partial<User>;
  schools: any[];
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

  // This useEffect hook is the single source of truth for rehydrating the user session.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('educentral-user');
      const storedToken = localStorage.getItem('contextJWT');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        
        // THE DEFINITIVE FIX: Re-initialize the API client's in-memory token after a page refresh.
        setAccessToken(storedToken);
        
        setUser(parsedUser);
        console.log("AuthProvider: Successfully hydrated user and token from localStorage.");
      } else {
        // If there is no user or token, ensure the in-memory token is also cleared.
        setAccessToken(null);
        console.log("AuthProvider: No user or token found in localStorage.");
      }
    } catch (error) {
      console.error('AuthProvider: Failed to parse user/token from localStorage. Clearing session.', error);
      localStorage.removeItem('educentral-user');
      localStorage.removeItem('sessionJWT');
      localStorage.removeItem('contextJWT');
      setAccessToken(null); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((data: LoginData) => {
    const { user: apiUser, schools: apiSchools = [], tenantRoles = [], sessionJwt, contextJwt } = data;

    let primaryTenantId: string | undefined;
    let tenantName: string | undefined;
    let primarySchoolId: string | undefined;
    let primaryRole: string | undefined;
    let classDetails: ClassDetails | undefined;

    if (tenantRoles?.[0]?.roles?.length > 0) {
        const tenant = tenantRoles[0];
        primaryTenantId = tenant.tenantId;
        tenantName = tenant.tenantName;
        primaryRole = tenant.roles[0];
    } else if (apiSchools?.[0]?.roles?.length > 0) {
        const school = apiSchools[0];
        primaryTenantId = school.tenantId;
        tenantName = school.tenantName;
        primarySchoolId = school.schoolId;
        primaryRole = school.roles[0];
        classDetails = school.classDetails;
    } else {
        console.error("AuthProvider FATAL: Cannot determine a valid role from login response.", data);
        return;
    }

    if (!primaryTenantId || !primaryRole) {
        console.error("AuthProvider FATAL: Could not resolve TenantId or a primary Role.", { primaryTenantId, primaryRole });
        return;
    }

    const userForContext: User = {
        ...apiUser,
        id: apiUser.id!,
        name: `${apiUser.firstName} ${apiUser.lastName}`,
        email: apiUser.email!,
        role: primaryRole,
        tenantId: primaryTenantId,
        tenantName: tenantName,
        schoolId: primarySchoolId,
        classDetails: classDetails,
        tenantRoles: tenantRoles,
        schools: apiSchools.map(s => ({ ...s, id: s.schoolId })),
    };

    // Set the token in the API client FIRST to ensure all subsequent calls are authenticated.
    setAccessToken(contextJwt);

    setUser(userForContext);
    localStorage.setItem('educentral-user', JSON.stringify(userForContext));
    localStorage.setItem('sessionJWT', sessionJwt);
    localStorage.setItem('contextJWT', contextJwt);

    console.log("AuthProvider: Login successful. User and tokens stored.");
    router.push('/homepage');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    
    // Clear the token from the API client FIRST.
    setAccessToken(null);

    localStorage.removeItem('educentral-user');
    localStorage.removeItem('sessionJWT');
    localStorage.removeItem('contextJWT');
    
    console.log("AuthProvider: Logout successful. User and tokens cleared.");
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
