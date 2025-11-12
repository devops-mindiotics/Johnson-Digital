'use client';
// src/lib/api/auth.ts
import apiClient from './client';
import { setJWT } from '@/lib/utils/token';
import type { LoginResponse } from '@/types/loginresponse';
import { API_BASE_URL } from '@/lib/utils/constants';
import { saveRoles } from '@/lib/utils/getRole';

// Login API call
export async function loginUser(mobile: string, password: string): Promise<LoginResponse> {
  const phone = mobile;
  console.log('🌍 API Base URL loginUser:', API_BASE_URL);

  console.log("🚀 Logging in with...", { phone });
  const response = await apiClient.post('/auth/login', { data: { phone, password } });
  const data = response.data;

  if (data?.data?.user) {
    const user = data.data.user;
    if (data.data.schools && data.data.schools.length > 0) {
      user.schoolId = data.data.schools[0].schoolId;
      user.tenantId = data.data.schools[0].tenantId;
    }
    localStorage.setItem('educentral-user', JSON.stringify(user));
    setJWT(data);
    saveRoles(data);
  }

  return data;
}

// Refresh token API
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await apiClient.post('/refresh-token', { refreshToken });
    const newAccessToken = response.data?.data?.accessToken;
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
