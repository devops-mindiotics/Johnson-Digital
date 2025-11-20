'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLegalPdfViewer } from '@/hooks/use-legal-pdf-viewer';

export const LegalPdfViewerDialog: React.FC = () => {
  const { isLegalPdfOpen, legalPdfUrl, legalPdfTitle, closeLegalPdf } = useLegalPdfViewer();

  return (
    <Dialog open={isLegalPdfOpen} onOpenChange={(isOpen) => !isOpen && closeLegalPdf()}>
      <DialogContent className="p-0 border-0 w-screen h-screen max-w-none">
        <DialogClose asChild className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon" onClick={closeLegalPdf}>
              <X className="h-6 w-6 text-white bg-black rounded-full" />
            </Button>
        </DialogClose>
        <iframe
          src={legalPdfUrl ? `${legalPdfUrl}#view=FitH&pagemode=none` : undefined}
          className="w-full h-full"
          style={{ border: 'none' }}
          title={legalPdfTitle}
        />
      </DialogContent>
    </Dialog>
  );
};
