  
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn(
    '⚠️  Missing NEXT_PUBLIC_API_BASE_URL in .env.local — falling back to localhost.'
  );
} else {
  console.log('🌍 Loaded API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
}

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_STORAGE_KEY = 'educentral-user';

