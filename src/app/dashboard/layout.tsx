'use client';
import { Suspense, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardFooter } from '@/components/dashboard-footer';
import { SidebarNav } from '@/components/sidebar-nav';
import { SidebarHeader } from '@/components/sidebar-header';
import { DashboardSkeleton } from '@/components/ui/loader';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="w-full max-w-7xl">
                <DashboardSkeleton />
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar collapsible="icon">
          <SidebarHeader />
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Suspense fallback={<DashboardSkeleton />}>
                {children}
              </Suspense>
            </main>
            <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
