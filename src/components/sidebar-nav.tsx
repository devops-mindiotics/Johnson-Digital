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
                  {!open && Icon && <Icon className="shrink-0" />}
                  <span className={open ? "truncate" : "sr-only"}>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        <SidebarMenuItem onClick={handleLinkClick}>
          <Link href="/legal" passHref>
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
              {!open && <Shield className="shrink-0" />}
              <span className={open ? "truncate" : "sr-only"}>Legal</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            tooltip={{ children: 'Logout', side: 'right' }}
            aria-label="Logout"
          >
            {!open && <LogOut className="shrink-0" />}
            <span className={open ? "truncate" : "sr-only"}>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
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
