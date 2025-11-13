'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';
import { Toaster } from '@/components/ui/toaster';
import { GlobalLoader } from '@/components/GlobalLoader';
import { PdfViewerProvider } from '@/hooks/use-pdf-viewer';
import { PdfViewer } from '@/components/pdf-viewer';
import { LegalPdfViewerProvider } from '@/hooks/use-legal-pdf-viewer';
import { LegalPdfViewerDialog } from '@/components/legal-pdf-viewer-dialog';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <PdfViewerProvider>
          <LegalPdfViewerProvider>
            {children}
            <PdfViewer />
            <LegalPdfViewerDialog />
          </LegalPdfViewerProvider>
        </PdfViewerProvider>
        <GlobalLoader />
        <Toaster />
      </LoadingProvider>
    </AuthProvider>
  );
}
