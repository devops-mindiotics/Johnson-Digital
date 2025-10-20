export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    phone: string;
    globalRoles: string[];
    tenants: any[];
    tokens: Tokens;
  };
  meta: {
    requestId: string;
    timestamp: string;
    tokenExpiresInSec: number;
  };
}
