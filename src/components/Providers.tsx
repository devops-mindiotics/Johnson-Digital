'use client';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { LoadingProvider } from '@/contexts/loading-context';
import { GlobalLoader } from '@/components/GlobalLoader';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        {children}
        <GlobalLoader />
      <Toaster />
      </LoadingProvider>
    </AuthProvider>
  );
}
