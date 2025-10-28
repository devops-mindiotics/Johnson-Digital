export interface Tokens {
  accessToken: string;
  refreshToken: string;
}


export interface LoginResponse {
  success: boolean;
  status?: string;
  message?: string;
  data?: LoginData | null;
  meta?: LoginMeta | null;
}

export interface LoginData {
  sessionJwt?: string | null;
  user?: User | null;
  tenantRoles?: TenantRole[] | null;
  schools?: SchoolRole[] | null;
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
  roles?: string[] | null;
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
