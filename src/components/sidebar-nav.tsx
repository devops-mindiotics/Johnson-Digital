'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { getSidebarNav } from '@/lib/sidebar';

export function SidebarNav() {
  const { user } = useAuth();
  const sidebarNav = getSidebarNav(user?.role as string);
  const { isMobile, setOpenMobile, open } = useSidebar();
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      {sidebarNav.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={{ children: item.title, side: 'right' }}
              data-active={pathname === item.href}
              aria-label={item.title}
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <Icon className="shrink-0" />
                <span className={open ? 'truncate' : 'sr-only'}>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
