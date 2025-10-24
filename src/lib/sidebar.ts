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
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/schools', icon: School, title: 'Schools' },
  { href: '/homepage/users', icon: Users, title: 'Users' },
  { href: '/homepage/classes', icon: Book, title: 'Classes' },
  { href: '/homepage/content', icon: FolderKanban, title: 'Content' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/banners', icon: Image, title: 'Banners' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

const schoolAdminSidebar = [
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/users', icon: Users, title: 'Users' },
  { href: '/homepage/classes', icon: Book, title: 'Classes' },
  { href: '/homepage/content', icon: FolderKanban, title: 'Content' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/banners', icon: Image, title: 'Banners' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

const teacherSidebar = [
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/my-classes', icon: BookOpen, title: 'Start Learning' },
  { href: '/homepage/diary', icon: PenSquare, title: 'Diary' },
  { href: '/homepage/assignments', icon: PenSquare, title: 'Assignments' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

const studentSidebar = [
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/my-classes', icon: BookOpen, title: 'Start Learning' },
  { href: '/homepage/diary', icon: PenSquare, title: 'Diary' },
  { href: '/homepage/assignments', icon: PenSquare, title: 'Assignments' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

export function getSidebarNav(role: string) {
  switch (role) {
    case 'tenantadmin':
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
