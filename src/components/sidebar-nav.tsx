'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { getSidebarNav } from '@/lib/sidebar';
import { LogOut, Shield } from 'lucide-react';

export function SidebarNav() {
  const { user, logout } = useAuth();
  const sidebarNav = getSidebarNav(user?.role as string);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarMenu>
        {sidebarNav.map((item, index) => (
          <SidebarMenuItem key={index} onClick={handleLinkClick}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                icon={item.icon}
                tooltip={{ children: item.title, side: 'right' }}
                aria-label={item.title}
              >
                {item.title}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        <SidebarMenuItem onClick={handleLinkClick}>
          <Link href="/legal" passHref>
            <SidebarMenuButton
              icon={Shield}
              tooltip={{ children: 'Legal', side: 'right' }}
              aria-label="Legal"
            >
              Legal
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            icon={LogOut}
            tooltip={{ children: 'Logout', side: 'right' }}
            aria-label="Logout"
          >
            Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
