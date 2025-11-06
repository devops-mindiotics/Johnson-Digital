'use client';
import { usePdfViewer } from '@/hooks/use-pdf-viewer';
import { PdfViewerDialog } from '@/components/pdf-viewer-dialog';

export function PdfViewer() {
  const { isPdfOpen, pdfUrl, pdfTitle, closePdf } = usePdfViewer();

  return (
    <PdfViewerDialog
      isOpen={isPdfOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closePdf();
        }
      }}
      pdfUrl={pdfUrl}
      title={pdfTitle}
    />
  );
}
