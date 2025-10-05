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
  Bug
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
  { href: '/dashboard/classes', icon: Book, title: 'Classes' },
  { href: '/dashboard/students', icon: GraduationCap, title: 'Students' },
  { href: '/dashboard/diary', icon: PenSquare, title: 'Diary' },
  { href: '/dashboard/homework', icon: PenSquare, title: 'Assignments' },
  { href: '/dashboard/profile', icon: User, title: 'Profile' },
  { href: '/dashboard/report', icon: Bug, title: 'Report' },
];

const studentSidebar = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/diary', icon: PenSquare, title: 'Diary' },
  { href: '/dashboard/homework', icon: PenSquare, title: 'Assignments' },
  { href: '/dashboard/profile', icon: User, title: 'Profile' },
  { href: '/dashboard/report', icon: Bug, title: 'Report' },
];

export function getSidebarNav(role: string) {
  switch (role) {
    case 'Super Admin':
      return superAdminSidebar;
    case 'School Admin':
      return schoolAdminSidebar;
    case 'Teacher':
      return teacherSidebar;
    case 'Student':
      return studentSidebar;
    default:
      return [];
  }
}
