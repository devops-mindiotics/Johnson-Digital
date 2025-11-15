
import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// NOTE: These interfaces are now aligned with the API response and src/types/loginresponse.ts

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

// This is the definitive User object structure that will be stored in localStorage
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  avatarUrl?: string;

  // Core authorization properties
  role: string; // The user's primary, active role
  tenantId: string;
  tenantName?: string;
  schoolId?: string; // Only present for school-level users

  // Full, original data from the API for other modules to use
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
    let tenantName: string | undefined;
    let primarySchoolId: string | undefined;
    let primaryRole: string | undefined;
    let classDetails: ClassDetails | undefined;

    // HIERARCHICAL LOGIC: Determine role and IDs based on the API response structure
    // Priority 1: Check for a role at the Tenant level.
    if (tenantRoles?.[0]?.roles?.length > 0) {
      const tenant = tenantRoles[0];
      primaryTenantId = tenant.tenantId;
      tenantName = tenant.tenantName;
      primaryRole = tenant.roles[0];
      console.log(`AuthProvider: Detected TENANT role (${primaryRole}) for tenant ${primaryTenantId}`);

    // Priority 2: If no tenant role, check for a role at the School level.
    } else if (apiSchools?.[0]?.roles?.length > 0) {
      const school = apiSchools[0];
      primaryTenantId = school.tenantId;
      tenantName = school.tenantName; 
      primarySchoolId = school.schoolId;
      primaryRole = school.roles[0];
      classDetails = school.classDetails;
      console.log(`AuthProvider: Detected SCHOOL role (${primaryRole}) for school ${primarySchoolId}`);

    } else {
      console.error("AuthProvider FATAL: Cannot determine a valid role from login response. Aborting.", data);
      // Optionally, you can trigger a logout or show an error message to the user here.
      return;
    }

    if (!primaryTenantId || !primaryRole) {
      console.error("AuthProvider FATAL: Could not resolve TenantId or a primary Role. Aborting login.", { primaryTenantId, primaryRole });
      return;
    }

    const formattedSchools = apiSchools.map(school => ({
      ...school,
      id: school.schoolId, // Ensure a consistent `id` field for frontend use
    }));

    // CONSTRUCT THE DEFINITIVE USER OBJECT
    const userForContext: User = {
      // Base user info
      ...apiUser,
      id: apiUser.id!,
      name: `${apiUser.firstName} ${apiUser.lastName}`,
      email: apiUser.email!,

      // Derived primary role and IDs
      role: primaryRole,
      tenantId: primaryTenantId,
      tenantName: tenantName,
      schoolId: primarySchoolId,
      classDetails: classDetails,

      // Full original data for other modules
      tenantRoles: tenantRoles, 
      schools: formattedSchools,
    };

    console.log("AuthProvider: Storing FINAL, COMPLETE user object to localStorage:", userForContext);

    setUser(userForContext);
    localStorage.setItem('educentral-user', JSON.stringify(userForContext));
    localStorage.setItem('sessionJWT', sessionJwt);
    localStorage.setItem('contextJWT', contextJwt);

    router.push('/homepage');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('educentral-user');
    localStorage.removeItem('sessionJWT');
    localStorage.removeItem('contextJWT');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
