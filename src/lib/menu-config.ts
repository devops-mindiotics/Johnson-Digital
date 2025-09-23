import {
  Users,
  LayoutDashboard,
  Settings,
  BookCopy,
  Megaphone,
  GraduationCap,
  UserCircle,
  Image,
  School, 
  BookUser, 
  FolderGit, 
  StickyNote, 
  GalleryVertical, 
  BookText, 
  BookMarked, 
  Book
} from 'lucide-react';
import type { UserRole } from '@/contexts/auth-context';

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  color?: string;
  children?: MenuItem[];
}

export const menuConfig: Record<UserRole, MenuItem[]> = {
  'Super Admin': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-sky-500' },
    { label: 'Schools', href: '/dashboard/schools', icon: School, color: 'text-orange-500' },
    { label: 'Users', href: '/dashboard/users', icon: Users, color: 'text-violet-500' },
    { label: 'Classes', href: '/dashboard/classes', icon: BookUser, color: 'text-green-500' },
    { label: 'Content', href: '/dashboard/content', icon: FolderGit, color: 'text-blue-500' },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: StickyNote, color: 'text-yellow-500' },
    { label: 'Banners', href: '/dashboard/banners', icon: GalleryVertical, color: 'text-pink-500' },
  ],
  'School Admin': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-sky-500' },
    { label: 'School Profile', href: '/dashboard/school-profile', icon: School, color: 'text-orange-500' },
    { label: 'Users', href: '/dashboard/users', icon: Users, color: 'text-violet-500' },
    { label: 'Classes', href: '/dashboard/classes', icon: BookUser, color: 'text-green-500' },
    { label: 'Diary', href: '/dashboard/diary', icon: BookText, color: 'text-teal-500' },
    { label: 'Homework', href: '/dashboard/homework', icon: BookMarked, color: 'text-indigo-500' },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: StickyNote, color: 'text-yellow-500' },
    { label: 'Banners', href: '/dashboard/banners', icon: GalleryVertical, color: 'text-pink-500' },
  ],
  Teacher: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-sky-500' },
    { label: 'My Classes', href: '/dashboard/my-classes', icon: BookUser, color: 'text-green-500' },
    { label: 'Diary', href: '/dashboard/diary', icon: BookText, color: 'text-teal-500' },
    { label: 'Homework', href: '/dashboard/homework', icon: BookMarked, color: 'text-indigo-500' },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: StickyNote, color: 'text-yellow-500' },

  ],
  Student: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-sky-500' },
    { label: 'Subjects', href: '/dashboard/subjects', icon: Book, color: 'text-purple-500' },
    { label: 'Diary', href: '/dashboard/diary', icon: BookText, color: 'text-teal-500' },
    { label: 'Homework', href: '/dashboard/homework', icon: BookMarked, color: 'text-indigo-500' },
    { label: 'Notice Board', href: '/dashboard/notice-board', icon: StickyNote, color: 'text-yellow-500' },
  ],
};

export const commonMenuItems: MenuItem[] = [
  { label: 'Profile', href: '/dashboard/profile', icon: UserCircle, color: 'text-gray-500' },
];
