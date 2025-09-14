'use client';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="h-[calc(100vh-12rem)] w-full" />
    </div>
  );
}
