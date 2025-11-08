'use client';
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { setLoadingRef } from '@/components/global-loader-access';



interface LoadingContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
   // register global access when context mounts
  useEffect(() => {
    setLoadingRef({ showLoader, hideLoader });
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
