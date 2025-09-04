'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldQuestion } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useAuth } from '@/hooks/use-auth';
import { menuConfig, commonMenuItems, type MenuItem } from '@/lib/menu-config';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
      <SidebarMenu>{renderMenuItems(allMenuItems)}</SidebarMenu>
      <div className="mt-auto flex flex-col gap-1 p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start group-data-[collapsible=icon]:justify-center"
            >
              <ShieldQuestion />
              <span className="group-data-[collapsible=icon]:hidden">
                Legal
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="right" align="start">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                EULA
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Terms & Conditions
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator className="my-1" />

        <SidebarMenuButton
          onClick={logout}
          className="w-full justify-start group-data-[collapsible=icon]:justify-center"
          tooltip={{ children: 'Logout', side: 'right' }}
        >
          <LogOut />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </SidebarMenuButton>
      </div>
    </>
  );
}
