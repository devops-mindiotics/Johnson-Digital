'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LegalPdfViewerContextType {
  isLegalPdfOpen: boolean;
  legalPdfUrl: string;
  legalPdfTitle: string;
  openLegalPdf: (url: string, title: string) => void;
  closeLegalPdf: () => void;
}

const LegalPdfViewerContext = createContext<LegalPdfViewerContextType | undefined>(undefined);

export const useLegalPdfViewer = () => {
  const context = useContext(LegalPdfViewerContext);
  if (!context) {
    throw new Error('useLegalPdfViewer must be used within a LegalPdfViewerProvider');
  }
  return context;
};

interface LegalPdfViewerProviderProps {
  children: ReactNode;
}

export const LegalPdfViewerProvider = ({ children }: LegalPdfViewerProviderProps) => {
  const [isLegalPdfOpen, setIsLegalPdfOpen] = useState(false);
  const [legalPdfUrl, setLegalPdfUrl] = useState('');
  const [legalPdfTitle, setLegalPdfTitle] = useState('');

  const openLegalPdf = (url: string, title: string) => {
    setLegalPdfUrl(url);
    setLegalPdfTitle(title);
    setIsLegalPdfOpen(true);
  };

  const closeLegalPdf = () => {
    setIsLegalPdfOpen(false);
    setLegalPdfUrl('');
    setLegalPdfTitle('');
  };

  return (
    <LegalPdfViewerContext.Provider value={{ isLegalPdfOpen, legalPdfUrl, legalPdfTitle, openLegalPdf, closeLegalPdf }}>
      {children}
    </LegalPdfViewerContext.Provider>
  );
};
