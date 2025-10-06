'use client';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import { GoldBadge } from './ui/gold-badge';

export function SidebarHeader() {
  const { user } = useAuth();

  if (!user) return null;

  const baseName = user.name ? user.name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/, '') : '';
  let displayName = baseName;
  if (user.role !== 'Student' && typeof user.gender === 'string' && user.gender) {
    const gender = user.gender.toLowerCase();
    if (gender === 'male') {
      displayName = `Mr. ${baseName}`;
    } else if (gender === 'female') {
      displayName = `Ms. ${baseName}`;
    }
  }

  return (
    <div className="flex flex-col pt-3">
      <div className="flex items-center gap-2 p-3 group-data-[collapsible=icon]:hidden">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profilePic} alt={displayName} />
          <AvatarFallback>{baseName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sidebar-foreground overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{displayName}</p>
            {user.role === 'Student' && user.isPremium && <GoldBadge />}
                  {user.role === 'Student' && (
                  <p className="hidden text-sm text-muted-foreground sm:block">
                      ({user.class})
                  </p>
                 )}
                    <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-2 py-1 rounded-full">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                 </span>
            {/* {user.isPremium && (
              <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-2 py-1 rounded-full">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </span>
            )} */}
          </div>
          <p className="text-xs text-sidebar-foreground/80 truncate">
            {user.role}
          </p>
          <p className="text-xs text-sidebar-foreground/80 truncate">
            {user.mobile}
          </p>
        </div>
      </div>
    </div>
  // return (
      // <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 z-10">
      //   <div className="flex items-center gap-2">
      //     {showBackButton && (
      //         <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.back()}>
      //             <ChevronLeft className="h-5 w-5" />
      //             <span className="sr-only">Back</span>
      //         </Button>
      //     )}
      //     <SidebarTrigger />
          // <div className="flex flex-col">
          //     {/* <p className="text-lg font-semibold md:text-xl">{getGreeting()}!</p> */}
          //     <div className="flex items-center gap-2">
          //         <p className="text-sm">{displayName}</p>
          //         {user.role === 'Student' && user.isPremium && <GoldBadge />}
          //         {user.role === 'Student' && (
          //         <p className="hidden text-sm text-muted-foreground sm:block">
          //             ({user.class})
          //         </p>
          //         )}
          //          <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-2 py-1 rounded-full">
          //             <Crown className="w-3 h-3 mr-1" />
          //             Premium
          //         </span>
          //     </div>
          // </div>
        
  );
}
