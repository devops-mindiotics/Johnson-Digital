export interface Tokens {
  accessToken: string;
  refreshToken: string;
}


export interface LoginResponse {
  success: boolean;
  status?: string; // Optional because it may be missing when success = true
  message?: string;
  data?: LoginData | null; // May be null or missing when login fails
  meta?: LoginMeta | null; // Optional or null-safe
}

export interface LoginData {
  sessionJwt?: string | null;
  user?: User | null;
  tenantRoles?: TenantRole[] | null;
  schoolRoles?: SchoolRole[] | null;
  contextJwt?: string | null;
  requiresSelection?: boolean | null;
}

export interface User {
  userId: string;
  phone: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  globalRoles?: string[] | null;
}

export interface TenantRole {
  tenantId: string;
  tenantName: string;
  roles: string[];
}

export interface SchoolRole {
  tenantId: string;
  tenantName: string;
  schoolId: string;
  schoolName: string;
  roles: string[];
}

export interface LoginMeta {
  context?: {
    tenantId?: string;
    schoolId?: string;
    schoolName?: string;
  } | null;
  timestamp?: string | null;
}
