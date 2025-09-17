'use client';
import Link from 'next/link';
import {
  LogOut,
  Plus,
  Settings,
  User as UserIcon,
  ArrowLeft,
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
import { CardContent } from '@/components/ui/card';
import { UserPlus, UserCheck } from 'lucide-react';
import { School, ClipboardList } from 'lucide-react';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 z-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
        </Button>
        <SidebarTrigger />
        <h1 className="text-lg font-semibold md:text-xl">
          Hello, {user.name.split(' ')[0]}!
        </h1>
        {user.role === 'Student' && (
          <p className="hidden text-sm text-muted-foreground sm:block">
            ({user.class})
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user.role === 'Student' && (
          <Select defaultValue="child1">
            <SelectTrigger className="w-[150px] md:w-[200px]">
              <SelectValue placeholder="Switch Child" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="child1">{user.name}</SelectItem>
              <SelectItem value="child2">Jane Doe</SelectItem>
            </SelectContent>
          </Select>
        )}

        {user.role === 'Super Admin' && (
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
    <DropdownMenuItem onClick={() => router.push('/dashboard/content')}>
      <ClipboardList className="mr-2 h-4 w-4 text-green-600" />
      Add Content
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

        )}

        {user.role === 'School Admin' && (
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
            <div className="md:hidden">
  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <button
      onClick={() => router.push('/dashboard/users/add?type=Student')}
      className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border"
    >
      <div className="inline-flex items-center justify-center rounded-full bg-blue-50 p-3">
        <UserPlus className="h-6 w-6 text-blue-600" />
      </div>
      <div className="text-sm text-blue-700">Add Student</div>
    </button>

    <button
      onClick={() => router.push('/dashboard/users/add?type=Teacher')}
      className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border"
    >
      <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-3">
        <UserCheck className="h-6 w-6 text-green-600" />
      </div>
      <div className="text-sm text-green-700">Add Teacher</div>
    </button>
  </CardContent>
</div>

          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profilePic} alt={user.name} data-ai-hint="person avatar" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/profile" passHref>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              {(user.role === 'Student' || user.role === 'Teacher') && (
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
