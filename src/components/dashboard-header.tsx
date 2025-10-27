'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  Plus,
  Settings,
  User as UserIcon,ChevronLeft,ChevronRight,UserCircle, Crown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { FaPeopleArrows } from 'react-icons/fa6';
import { CardContent } from '@/components/ui/card';
import { UserPlus, UserCheck } from 'lucide-react';
import { School, ClipboardList } from 'lucide-react';
import { getRoles } from '@/lib/utils/getRole';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== '/dashboard';

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  
  const userRole = getRoles() || 'student';

  const baseName = user.displayName ? user.displayName.replace(/^(Dr\.|Mr\.|Ms\.)\s+/, '') : '';
  let displayName = baseName;
  const displayClass = "V";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 z-10">
      <div className="flex items-center gap-2">
        {showBackButton && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
        )}
        <SidebarTrigger />
        <div className="flex flex-col">
            <p className="text-lg font-semibold md:text-xl">{getGreeting()}!</p>
            <div className="flex items-center gap-2">
                <p className="text-sm">{displayName}</p>
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
        </div>
      </div>
      <div className="flex items-center gap-4">
        {userRole === 'student' && (
          <>
            {/* Web view */}
            <div className="hidden items-center gap-2 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Switch Child <FaPeopleArrows className="ml-2 h-4 w-4 text-blue-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>{displayName}</DropdownMenuItem>
                  <DropdownMenuItem>Jane Doe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Mobile view */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FaPeopleArrows className="h-5 w-5 text-blue-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{displayName}</DropdownMenuItem>
                  <DropdownMenuItem>Jane Doe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {userRole === 'tenantadmin' && (
            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      size="icon" 
      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Plus className="h-5 w-5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => router.push('/dashboard/schools/add')}>
      <School className="mr-2 h-4 w-4 text-blue-600" />
      Add School
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => router.push('/dashboard/content?add=true')}>
      <ClipboardList className="mr-2 h-4 w-4 text-green-600" />
      Add Content
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

        )}

        {userRole === 'schooladmin' && (
          <>
            <div className="hidden md:flex items-center gap-2">
  <Button 
    onClick={() => router.push('/dashboard/users/add?type=Student')}
    className="flex items-center gap-2"
  >
    <FaUserGraduate size={18} />
    Add Student
  </Button>

  <Button 
    onClick={() => router.push('/dashboard/users/add?type=Teacher')}
    className="flex items-center gap-2"
  >
    <FaChalkboardTeacher size={18} />
    Add Teacher
  </Button>
</div>

<div className="flex items-center gap-2 md:hidden">
  <Button
    size="icon"
    className="rounded-full bg-blue-50 hover:bg-blue-100"
    onClick={() => router.push('/dashboard/users/add?type=Student')}
  >
    <UserPlus className="h-5 w-5 text-blue-600" />
    <span className="sr-only">Add Student</span>
  </Button>

  <Button
    size="icon"
    className="rounded-full bg-green-50 hover:bg-green-100"
    onClick={() => router.push('/dashboard/users/add?type=Teacher')}
  >
    <UserCheck className="h-5 w-5 text-green-600" />
    <span className="sr-only">Add Teacher</span>
  </Button>
</div>

          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl ?? "https://picsum.photos/100"} alt={displayName} data-ai-hint="person avatar" />
                <AvatarFallback>{baseName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
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
                 <p className="text-xs leading-none text-muted-foreground">
                  {user.phone}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userRole}
                </p>
                 <p className="text-xs leading-none text-muted-foreground">
                  email@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/profile" passHref>
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4 text-purple-500" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              {(userRole === 'student' || userRole === 'teacher') && (
  <Link href="/dashboard/settings" passHref>
  </Link>
)}

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
