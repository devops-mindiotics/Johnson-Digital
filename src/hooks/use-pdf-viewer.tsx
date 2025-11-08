'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PdfViewerContextType {
  isPdfOpen: boolean;
  pdfUrl: string;
  pdfTitle: string;
  openPdf: (url: string, title: string) => void;
  closePdf: () => void;
}

const PdfViewerContext = createContext<PdfViewerContextType | undefined>(undefined);

export const usePdfViewer = () => {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error('usePdfViewer must be used within a PdfViewerProvider');
  }
  return context;
};

interface PdfViewerProviderProps {
  children: ReactNode;
}

export const PdfViewerProvider = ({ children }: PdfViewerProviderProps) => {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  const openPdf = (url: string, title: string) => {
    setPdfUrl(url);
    setPdfTitle(title);
    setIsPdfOpen(true);
  };

  const closePdf = () => {
    setIsPdfOpen(false);
    setPdfUrl('');
    setPdfTitle('');
  };

  return (
    <PdfViewerContext.Provider value={{ isPdfOpen, pdfUrl, pdfTitle, openPdf, closePdf }}>
      {children}
    </PdfViewerContext.Provider>
  );
};
