'use client';

import { Loader2 } from 'lucide-react';

export function PopUpLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="animate-spin text-white">
        <Loader2 className="h-16 w-16" />
      </div>
    </div>
  );
}
