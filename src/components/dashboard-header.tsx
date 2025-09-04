'use client';
import Link from 'next/link';
import {
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
  Users,
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

export function DashboardHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 z-10">
      <div className="flex items-center gap-2">
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
              <Link href="/dashboard/settings" passHref>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
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
