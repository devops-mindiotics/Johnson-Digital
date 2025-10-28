'use client';
import { useState, useEffect } from 'react';
import { Loader } from '@/components/ui/loader';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    window.addEventListener('show-loader', showLoader);
    window.addEventListener('hide-loader', hideLoader);

    return () => {
      window.removeEventListener('show-loader', showLoader);
      window.removeEventListener('hide-loader', hideLoader);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Loader />
    </div>
  );
};

export default GlobalLoader;
