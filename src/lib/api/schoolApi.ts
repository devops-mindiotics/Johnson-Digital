import apiClient from './client';
import { setTokens,setJWT } from '@/lib/utils/token';
import type { SchoolCreateResponse } from '@/types/school/schoolCreateResponse';
import { API_BASE_URL } from '@/lib/utils/constants';
import { saveRoles } from '@/lib/utils/getRole';


export async function createSchool(): Promise<SchoolCreateResponse> {

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