// src/lib/utils/token.ts

import type { LoginResponse } from '@/types/loginresponse';


const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const SESSION_JWT = 'sessionJWT';
const CONTEXT_JWT = 'contextJWT';

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function setAccessToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function setJWT(loginResponse: LoginResponse) {
  if (typeof window === 'undefined') return; 

  const sessionJwt = loginResponse?.data?.sessionJwt ?? '';
  const contextJwt = loginResponse?.data?.contextJwt ?? '';
 
  localStorage.removeItem(SESSION_JWT);
  localStorage.removeItem(CONTEXT_JWT);

  if (isValidToken(sessionJwt)) {
    localStorage.setItem(SESSION_JWT, sessionJwt.trim());
  }

  if (isValidToken(contextJwt)) {
    localStorage.setItem(CONTEXT_JWT, contextJwt.trim());
  }
}

function isValidToken(token?: string | null): boolean {
  return !!token && typeof token === 'string' && token.trim().length > 0;
}

export function getJWT(): string {
  if (typeof window === 'undefined') return '';  

  const contextJwt = localStorage.getItem(CONTEXT_JWT)?.trim() || '';
  const sessionJwt = localStorage.getItem(SESSION_JWT)?.trim() || '';

  if (contextJwt !== '') {
    return contextJwt;
  }

  if (sessionJwt !== '') {
    return sessionJwt;
  }

  return '';  
}