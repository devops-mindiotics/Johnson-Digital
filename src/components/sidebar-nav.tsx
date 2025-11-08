'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { getSidebarNav } from '@/lib/sidebar';
import React from 'react';
import { getRoles } from '@/lib/utils/getRole';
import { ChevronDown } from 'lucide-react';

export function SidebarNav() {
  const userRole = getRoles() || 'student';
  const { user } = useAuth();
  const sidebarNav = getSidebarNav(userRole as string);
  const { isMobile, setOpenMobile, open } = useSidebar();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (!user) {
    return null;
  }

  const renderMenuItem = (item: any, index: number) => {
    const Icon = item.icon;

    if (item.children) {
      const isMenuOpen = openMenus.includes(item.title);
      return (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton
            onClick={() => toggleMenu(item.title)}
            tooltip={{ children: item.title, side: 'right' }}
            aria-label={item.title}
            className="justify-between"
          >
            <div className="flex items-center gap-2">
              {Icon && <Icon className="shrink-0" size={16} />}
              <span className={open ? 'truncate' : 'sr-only'}>{item.title}</span>
            </div>
            <ChevronDown
              className={`shrink-0 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
              size={16}
            />
          </SidebarMenuButton>
          {isMenuOpen && (
            <SidebarMenuSub>
              {item.children.map(renderMenuItem)}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuSubItem key={index}>
        <Link
          href={item.href!}
          onClick={handleLinkClick}
          data-active={pathname === item.href}
          className="flex items-center gap-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {Icon && <Icon className="shrink-0" size={16} />}
          <span className={open ? 'truncate' : 'sr-only'}>{item.title}</span>
        </Link>
      </SidebarMenuSubItem>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarMenu>
        {sidebarNav.map((item, index) => {
          const Icon = item.icon;
          if (item.children) {
            return renderMenuItem(item, index);
          }

          return (
            <SidebarMenuItem key={index}>
              <Link href={item.href!}>
                <SidebarMenuButton
                  onClick={handleLinkClick}
                  tooltip={{ children: item.title, side: 'right' }}
                  aria-label={item.title}
                  data-active={pathname === item.href}
                >
                  {Icon && <Icon className="shrink-0" size={16} />}
                  <span className={open ? 'truncate' : 'sr-only'}>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
}
