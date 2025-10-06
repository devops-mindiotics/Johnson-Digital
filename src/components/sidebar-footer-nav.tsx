'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { LogOut, Shield } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function SidebarFooterNav() {
  const { user, logout } = useAuth();
  const { isMobile, setOpenMobile, open } = useSidebar();

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
      <SidebarMenuItem key="legal">
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              tooltip={{ children: 'Legal', side: 'right' }}
              aria-label="Legal"
            >
              <Shield className="shrink-0" />
              <span className={open ? "truncate" : "sr-only"}>Legal</span>
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent className="w-56" side="top" align="center">
            <div className="space-y-2 p-2">
              <Link href="/eula" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">End User License Agreement</Link>
              <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Privacy Policy</Link>
              <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Terms & Conditions</Link>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
      <SidebarMenuItem key="logout">
        <SidebarMenuButton
          onClick={() => {
            logout();
            handleLinkClick();
          }}
          tooltip={{ children: 'Logout', side: 'right' }}
          aria-label="Logout"
        >
          <LogOut className="shrink-0" />
          <span className={open ? "truncate" : "sr-only"}>Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
