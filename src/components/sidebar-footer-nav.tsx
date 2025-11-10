'use client';
import { useAuth } from '@/hooks/use-auth';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { LogOut, Shield } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLegalPdfViewer } from '@/hooks/use-legal-pdf-viewer';

export function SidebarFooterNav() {
  const { user, logout } = useAuth();
  const { isMobile, setOpenMobile, open } = useSidebar();
  const { openLegalPdf } = useLegalPdfViewer();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleOpenPdf = (url: string, title: string) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    openLegalPdf(url, title);
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
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
            <button onClick={() => handleOpenPdf('https://storage.googleapis.com/johnson-documents/EULA-JohnsonDigital.pdf', 'End User License Agreement')} className="block text-sm hover:underline text-left w-full">End User License Agreement</button>
            <button onClick={() => handleOpenPdf('https://storage.googleapis.com/johnson-documents/PrivacyPolicy-JohnsonDigital.pdf', 'Privacy Policy')} className="block text-sm hover:underline text-left w-full">Privacy Policy</button>
            <button onClick={() => handleOpenPdf('https://storage.googleapis.com/johnson-documents/TnC-JohnsonDigital.pdf', 'Terms & Conditions')} className="block text-sm hover:underline text-left w-full">Terms & Conditions</button>
          </div>
        </PopoverContent>
      </Popover>
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
