
'use client';

import { useLoading } from '@/contexts/loading-context';

export function GlobalLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
  <div className="flex flex-col items-center justify-center">
    <img
      src="/JPSwan-Blue.svg"
      alt="Loading..."
      className="h-20 w-20 animate-pulse"
    />
    <p className="mt-4 text-lg font-semibold text-white tracking-wide">
      Loading...
    </p>
  </div>
</div>

  );
}
