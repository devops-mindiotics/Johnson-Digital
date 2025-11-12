'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';

export function SidebarNav({ items, setSidebarOpen }: any) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item: any, index: number) => (
        <SidebarMenuItem key={index}>
          {item.children ? (
            <Collapsible defaultOpen={item.children.some((child: any) => pathname.startsWith(child.href))}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={item.children.some((child: any) => pathname.startsWith(child.href))}
                  className="flex justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {item.children.map((child: any, childIndex: number) => (
                    <SidebarMenuItem key={childIndex}>
                      <Link href={child.href}>
                        <SidebarMenuSubButton
                          onClick={() => setSidebarOpen(false)}
                          isActive={pathname.startsWith(child.href)}
                        >
                          <child.icon className="h-4 w-4" />
                          <span>{child.title}</span>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link href={item.href}>
              <SidebarMenuButton
                onClick={() => setSidebarOpen(false)}
                isActive={pathname === item.href}
                className={cn(item.disabled && 'cursor-not-allowed opacity-80')}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.tag && (
                  <SidebarMenuBadge className={cn(
                    item.tag === 'Upcoming' && 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                  )}>{item.tag}</SidebarMenuBadge>
                )}
              </SidebarMenuButton>
            </Link>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
