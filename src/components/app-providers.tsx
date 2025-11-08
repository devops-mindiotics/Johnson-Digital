'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';
import { Toaster } from '@/components/ui/toaster';
import { GlobalLoader } from '@/components/GlobalLoader';
import { PdfViewerProvider } from '@/hooks/use-pdf-viewer';
import { PdfViewer } from '@/components/pdf-viewer';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <PdfViewerProvider>
          {children}
          <PdfViewer />
        </PdfViewerProvider>
        <GlobalLoader />
        <Toaster />
      </LoadingProvider>
    </AuthProvider>
  );
}
