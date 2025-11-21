'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  Plus,
  Settings,
  User as UserIcon,ChevronLeft,ChevronRight,UserCircle, Crown, Mail, Phone, Shield
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
import { SUPERADMIN, SCHOOLADMIN, TEACHER, STUDENT, TENANTADMIN } from '@/lib/utils/constants';

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

export function HomepageHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 16) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getSalutation = () => {
    if (user && user.gender) {
      if (user.gender.toLowerCase() === 'male') return 'Mr.';
      if (user.gender.toLowerCase() === 'female') return 'Ms.';
    }
    return '';
  };

  
  const userRole = getRoles() || STUDENT;

  const salutation = getSalutation();
  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`: '';
  const finalDisplayName = `${salutation ? `${salutation} ` : ''}${displayName}`;
  const classDetails = user?.schools?.[0]?.classDetails;
  const displayClass = classDetails
    ? `${classDetails.className}${classDetails.sectionName && classDetails.sectionName !== 'No Sections' ? `, ${classDetails.sectionName}` : ''}`
    : '';

  return (
    <header className="flex h-auto shrink-0 items-center justify-between border-b px-4 md:px-6 py-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
          <p className="text-base font-semibold md:text-xl">{getGreeting()}!</p>
            {userRole === STUDENT && (
                <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-1.5 py-0.5 rounded-full w-fit">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                </span>
            )}
          </div>
          <p className="text-sm">{finalDisplayName}</p>
          {userRole === STUDENT && displayClass && (
            <p className="text-sm text-muted-foreground">
                {displayClass}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {userRole === STUDENT && (
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
                  <DropdownMenuItem>{finalDisplayName}</DropdownMenuItem>
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
                  <DropdownMenuItem>{finalDisplayName}</DropdownMenuItem>
                  <DropdownMenuItem>Jane Doe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {userRole === TENANTADMIN && (
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
    <DropdownMenuItem onClick={() => router.push('/homepage/schools/add')}>
      <School className="mr-2 h-4 w-4 text-blue-600" />
      Add School
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => router.push('/homepage/content?add=true')}>
      <ClipboardList className="mr-2 h-4 w-4 text-green-600" />
      Add Content
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

        )}

        {userRole === SCHOOLADMIN && (
          <>
            <div className="hidden md:flex items-center gap-2">
  <Button 
    onClick={() => router.push('/homepage/users/add?type=Student')}
    className="flex items-center gap-2"
  >
    <FaUserGraduate size={18} />
    Add Student
  </Button>

  <Button 
    onClick={() => router.push('/homepage/users/add?type=Teacher')}
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
    onClick={() => router.push('/homepage/users/add?type=Student')}
  >
    <UserPlus className="h-5 w-5 text-blue-600" />
    <span className="sr-only">Add Student</span>
  </Button>

  <Button
    size="icon"
    className="rounded-full bg-green-50 hover:bg-green-100"
    onClick={() => router.push('/homepage/users/add?type=Teacher')}
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
                <AvatarImage src={getAvatarUrl(user)} alt={displayName} data-ai-hint="person avatar" />
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getAvatarUrl(user)} alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-base font-semibold leading-none">{displayName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-2">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{userRole}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/homepage/profile" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4 text-purple-500" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              {(userRole === STUDENT || userRole === TEACHER) && (
                <Link href="/homepage/settings" passHref>
                    <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </Link>
              )}

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
