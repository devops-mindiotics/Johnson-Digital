'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PdfViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pdfUrl: string;
  title: string;
}

export const PdfViewerDialog: React.FC<PdfViewerDialogProps> = ({ isOpen, onOpenChange, pdfUrl, title }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 w-screen h-screen max-w-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogClose asChild className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon">
              <X className="h-6 w-6 text-white bg-black rounded-full" />
            </Button>
        </DialogClose>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            style={{ border: 'none' }}
            title={title}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
