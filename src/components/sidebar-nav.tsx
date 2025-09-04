'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookText, LogOut, ShieldQuestion } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useAuth } from '@/hooks/use-auth';
import { menuConfig, commonMenuItems, type MenuItem } from '@/lib/menu-config';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function SidebarNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const userMenu = menuConfig[user.role] || [];
  const allMenuItems = [...userMenu, ...commonMenuItems];

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={pathname === item.href}
          tooltip={{ children: item.label, side: 'right' }}
        >
          <Link href={item.href}>
            <item.icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <>
      <SidebarHeader className="border-b">
        <Link href="/dashboard" aria-label="Home">
          <Logo iconOnly className="group-data-[collapsible=icon]:block hidden" />
          <Logo className="group-data-[collapsible=icon]:hidden block" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>{renderMenuItems(allMenuItems)}</SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <ShieldQuestion className="mr-2 h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Legal
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="right" align="start">
            <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start">EULA</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">Privacy Policy</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">Terms & Conditions</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </>
  );
}
