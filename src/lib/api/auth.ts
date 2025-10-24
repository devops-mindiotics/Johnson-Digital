// src/lib/api/auth.ts
import apiClient from './client';
import { setTokens,setJWT } from '@/lib/utils/token';
import type { LoginResponse } from '@/types/loginresponse';
import { API_BASE_URL } from '@/lib/utils/constants';
import { saveRoles } from '@/lib/utils/getRole';

// Login API call
export async function loginUser(mobile: string, password: string): Promise<LoginResponse> {
  //  const phone = mobile.startsWith('+91') ? mobile : `+91${mobile}`;
  const phone = mobile;
  console.log('🌍 API Base URL loginUser:', API_BASE_URL);

  console.log("🚀 Unable to login. formattedMobile", { phone });
  const response = await apiClient.post('/auth/login', { phone, password });
  const data = response.data;

  if(data != null){
    setJWT(data);
    saveRoles(data);
  }
  
  if (data?.data?.tokens) {
    setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    
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
