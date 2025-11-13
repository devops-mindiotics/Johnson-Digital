'use client';
import { Suspense, useEffect, useMemo, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { HomepageHeader } from '@/components/homepage-header';
import { HomepageFooter } from '@/components/homepage-footer';
import { SidebarNav } from '@/components/sidebar-nav';
import { SidebarHeader } from '@/components/sidebar-header';
import { SidebarFooterNav } from '@/components/sidebar-footer-nav';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { getSidebarNav } from '@/lib/sidebar';

function Layout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const sidebarItems = useMemo(() => {
    if (!user?.roles) return [];
    const primaryRole = Array.isArray(user.roles) ? user.roles[0] : user.roles;
    return getSidebarNav(primaryRole);
  }, [user]);

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
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarHeader />
          <SidebarNav items={sidebarItems} setSidebarOpen={setOpenMobile} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarFooterNav />
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 border-b bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-lg">
          <HomepageHeader />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<DashboardSkeleton />}>
            {children}
          </Suspense>
        </main>
        <footer className="sticky bottom-0 z-10 border-t bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-lg">
          <HomepageFooter />
        </footer>
      </div>
    </div>
  );
}

export default function HomePageLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Layout>{children}</Layout>
    </SidebarProvider>
  );
}
