'use client';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import { Logo } from '@/components/logo';

import { getRoles } from '@/lib/utils/getRole';
import { STUDENT } from '@/lib/utils/constants';

const getAvatarUrl = (user: any) => {
  if (user.avatarUrl) {
    return user.avatarUrl;
  }

  if (user.gender === 'male') {
    return 'https://avatar.iran.liara.run/public/boy';
  }

  if (user.gender === 'female') {
    return 'https://avatar.iran.liara.run/public/girl';
  }

  return 'https://avatar.iran.liara.run/public';
};

export function SidebarHeader() {
  const { user } = useAuth();
  const userRole = getRoles() || STUDENT;

  if (!user) return null;

  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`: '';

  return (
    <div className="flex flex-col pt-3">
      <div className="flex items-center gap-2 p-3 group-data-[collapsible=icon]:hidden">
        <Logo variant="white" />
      </div>
      <div className="flex items-center gap-2 p-3 group-data-[collapsible=icon]:hidden">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getAvatarUrl(user)} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sidebar-foreground overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-base truncate">{displayName}</p>
            {userRole === STUDENT && (
              <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-2 py-1 rounded-full sm:hidden">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </span>
            )}
          </div>
          <p className="text-xs text-sidebar-foreground/80 truncate">
            {user.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
