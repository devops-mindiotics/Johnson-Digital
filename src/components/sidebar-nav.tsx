'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function SidebarNav({ items, setSidebarOpen }: any) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<any>({});

  const toggleItem = (item: any) => {
    setOpenItems({ ...openItems, [item.title]: !openItems[item.title] });
  };

  return (
    <nav className="grid items-start gap-1">
      {Array.isArray(items) && items.map((item: any, index: number) => {
        const isLinkActive = !item.children && pathname === item.href;
        const isSectionActive = item.children && item.children.some((child: any) => pathname.startsWith(child.href));

        return (
          <div key={index}>
            {item.children ? (
              <div
                className={`rounded-md ${isSectionActive ? "text-primary" : "text-foreground"}`}>
                <div 
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted rounded-md"
                  onClick={() => toggleItem(item)}>
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  {openItems[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                {openItems[item.title] && (
                  <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                    {item.children.map((child: any, childIndex: number) => {
                      const isChildLinkActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={childIndex}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 my-1 text-sm font-medium transition-colors ${isChildLinkActive ? 'bg-muted text-primary' : 'hover:bg-muted'}`}>
                          <child.icon className="h-5 w-5" />
                          <span>{child.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${isLinkActive ? 'bg-muted text-primary' : 'hover:bg-muted'}`}>
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                {item.tag && (
                    <span className="ml-auto text-xs font-semibold text-white bg-blue-500 px-2 py-0.5 rounded-full">
                        {item.tag}
                    </span>
                )}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
