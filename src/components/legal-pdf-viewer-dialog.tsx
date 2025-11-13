'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LegalPdfViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pdfUrl: string;
  title: string;
}

export const LegalPdfViewerDialog: React.FC<LegalPdfViewerDialogProps> = ({ isOpen, onOpenChange, pdfUrl, title }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 w-screen h-screen max-w-none">
        <DialogClose asChild className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon">
              <X className="h-6 w-6 text-white bg-black rounded-full" />
            </Button>
        </DialogClose>
        <iframe
          src={`${pdfUrl}#view=FitH&pagemode=none`}
          className="w-full h-full"
          style={{ border: 'none' }}
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};
