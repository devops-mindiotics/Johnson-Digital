'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader as GenericSidebarHeader, SidebarContent, SidebarFooter as GenericSidebarFooter } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardFooter } from '@/components/dashboard-footer';
import { SidebarNav } from '@/components/sidebar-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';
import Link from 'next/link';

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
        <div className="w-full max-w-7xl p-8 space-y-8">
            <div className="flex justify-between">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-[calc(100vh-12rem)] w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-background overflow-hidden">
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
        <SidebarInset>
          <div className="flex flex-col h-full">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
            <DashboardFooter />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
