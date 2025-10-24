'use client';
import { 
  LayoutDashboard,
  School, 
  Users, 
  Book, 
  PenSquare, 
  ClipboardList, 
  Image, 
  User, 
  FolderKanban, 
  GraduationCap,
  Bug,
  BookOpen,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const superAdminSidebar = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/schools', icon: School, title: 'Schools' },
  { href: '/dashboard/users', icon: Users, title: 'Users' },
  { href: '/dashboard/classes', icon: Book, title: 'Classes' },
  { href: '/dashboard/content', icon: FolderKanban, title: 'Content' },
  { href: '/dashboard/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/dashboard/banners', icon: Image, title: 'Banners' },
  { href: '/dashboard/profile', icon: User, title: 'Profile' },
  { href: '/dashboard/report', icon: Bug, title: 'Report' },
];

const schoolAdminSidebar = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/users', icon: Users, title: 'Users' },
  { href: '/dashboard/classes', icon: Book, title: 'Classes' },
  { href: '/dashboard/content', icon: FolderKanban, title: 'Content' },
  { href: '/dashboard/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/dashboard/banners', icon: Image, title: 'Banners' },
  { href: '/dashboard/profile', icon: User, title: 'Profile' },
  { href: '/dashboard/report', icon: Bug, title: 'Report' },
];

const teacherSidebar = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/my-classes', icon: BookOpen, title: 'Start Learning' },
  { href: '/dashboard/diary', icon: PenSquare, title: 'Diary' },
  { href: '/dashboard/assignments', icon: PenSquare, title: 'Assignments' },
  { href: '/dashboard/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/dashboard/profile', icon: User, title: 'Profile' },
  { href: '/dashboard/report', icon: Bug, title: 'Report' },
];

const studentSidebar = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/my-classes', icon: BookOpen, title: 'Start Learning' },
  { href: '/dashboard/diary', icon: PenSquare, title: 'Diary' },
  { href: '/dashboard/assignments', icon: PenSquare, title: 'Assignments' },
  { href: '/dashboard/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/dashboard/profile', icon: User, title: 'Profile' },
  { href: '/dashboard/report', icon: Bug, title: 'Report' },
];

export function getSidebarNav(role: string) {
  switch (role) {
    case 'super admin':
      return superAdminSidebar;
    case 'schooladmin':
      return schoolAdminSidebar;
    case 'teacher':
      return teacherSidebar;
    case 'student':
      return studentSidebar;
    default:
      return [];
  }
}
