'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { getSidebarNav } from '@/lib/sidebar';
import React from 'react';

import { getRoles } from '@/lib/utils/getRole';



export function SidebarNav() {
  const userRole = getRoles() || 'student';
  
  const { user, logout } = useAuth();
  const sidebarNav = getSidebarNav(userRole as string);
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
    <div className="flex flex-col h-full">
      <SidebarMenu>
        {sidebarNav.map((item, index) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={index} onClick={handleLinkClick}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  tooltip={{ children: item.title, side: 'right' }}
                  aria-label={item.title}
                  data-active={pathname === item.href}
                >
                  {Icon && <Icon className="shrink-0" />}
                  <span className={open ? 'truncate' : 'sr-only'}>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
}
