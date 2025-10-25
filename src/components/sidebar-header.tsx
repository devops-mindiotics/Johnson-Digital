'use client';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';

import { getRoles } from '@/lib/utils/getRole';

export function SidebarHeader() {
  const { user } = useAuth();
  const userRole = getRoles() || 'student';

  if (!user) return null;

  const baseName = user.displayName ? user.displayName.replace(/^(Dr\.|Mr\.|Ms\.)\s+/, '') : '';
  const displayName = baseName;
  const displayClass = "V";

  return (
    <div className="flex flex-col pt-3">
      <div className="flex items-center gap-2 p-3 group-data-[collapsible=icon]:hidden">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl ?? ""} alt={displayName} />
          <AvatarFallback>{baseName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sidebar-foreground overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{displayName}</p>
            {userRole === 'student' && (
              <p className="hidden text-sm text-muted-foreground sm:block">
                ({displayClass})
              </p>
            )}
            {userRole === 'student' && (
              <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-2 py-1 rounded-full">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </span>
            )}
          </div>
          <p className="text-xs text-sidebar-foreground/80 truncate">
            {userRole}
          </p>
          <p className="text-xs text-sidebar-foreground/80 truncate">
            {user.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
