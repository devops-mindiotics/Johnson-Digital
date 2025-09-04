import {
  Users,
  School,
  LayoutDashboard,
  Settings,
  BookCopy,
  FileText,
  Megaphone,
  Presentation,
  GraduationCap,
  FolderKanban,
  UserCircle,
} from 'lucide-react';
import type { UserRole } from '@/contexts/auth-context';

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

export const menuConfig: Record<UserRole, MenuItem[]> = {
  'Super Admin': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Schools', href: '/dashboard/schools', icon: School },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Roles & Menus', href: '/dashboard/roles', icon: FolderKanban },
    { label: 'Classes & Sections', href: '/dashboard/classes', icon: GraduationCap },
    { label: 'Content Management', href: '/dashboard/content', icon: BookCopy },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: Megaphone },
  ],
  'School Admin': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'School Profile', href: '/dashboard/school-profile', icon: School },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Classes & Sections', href: '/dashboard/classes', icon: GraduationCap },
    { label: 'Diary', href: '/dashboard/diary', icon: FileText },
    { label: 'Homework', href: '/dashboard/homework', icon: Presentation },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: Megaphone },
  ],
  Teacher: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Classes', href: '/dashboard/my-classes', icon: GraduationCap },
    { label: 'Diary', href: '/dashboard/diary', icon: FileText },
    { label: 'Homework', href: '/dashboard/homework', icon: Presentation },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: Megaphone },
  ],
  Student: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', href: '/dashboard/subjects', icon: BookCopy },
    { label: 'Diary', href: '/dashboard/diary', icon: FileText },
    { label: 'Homework', href: '/dashboard/homework', icon: Presentation },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: Megaphone },
  ],
};

export const commonMenuItems: MenuItem[] = [
  { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];
