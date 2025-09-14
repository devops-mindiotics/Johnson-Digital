'use client';
import { Suspense, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarHeader as GenericSidebarHeader, SidebarContent, SidebarFooter as GenericSidebarFooter } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardFooter } from '@/components/dashboard-footer';
import { SidebarNav } from '@/components/sidebar-nav';
import { Logo } from '@/components/logo';
import Link from 'next/link';
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
          <GenericSidebarHeader className="border-b">
            <Link href="/dashboard" aria-label="Home">
              <Logo iconOnly className="group-data-[collapsible=icon]:block hidden" />
              <Logo className="group-data-[collapsible=icon]:hidden block" />
            </Link>
          </GenericSidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <GenericSidebarFooter>
             {/* Can add footer items here */}
          </GenericSidebarFooter>
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
