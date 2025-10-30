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
  ShieldCheck,
  HelpCircle,
  Box
} from 'lucide-react';

import {  SUPERADMIN , SCHOOLADMIN , TENANTADMIN , TEACHER , STUDENT } from '@/lib/utils/constants';

const superAdminSidebar = [
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/schools', icon: School, title: 'Schools' },
  { href: '/homepage/users', icon: Users, title: 'Users' },
  {
    icon: GraduationCap,
    title: 'Masters',
    children: [
      { href: '/homepage/masters/series', icon: ClipboardList, title: 'Series' },
      { href: '/homepage/masters/packages', icon: Box, title: 'Packages' },
      { href: '/homepage/masters/classes', icon: School, title: 'Classes' },
      { href: '/homepage/masters/subjects', icon: Book, title: 'Subjects' },
      { href: '/homepage/masters/lessons', icon: BookOpen, title: 'Lessons' },
      { href: '/homepage/masters/content-types', icon: PenSquare, title: 'Content Types' },
    ],
  },
  { href: '/homepage/content', icon: FolderKanban, title: 'Content' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/banners', icon: Image, title: 'Banners' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/faq', icon: HelpCircle, title: 'FAQ' },
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
  { href: '/homepage/faq', icon: HelpCircle, title: 'FAQ' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

const teacherSidebar = [
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/my-classes', icon: BookOpen, title: 'Start Learning' },
  { href: '/homepage/diary', icon: PenSquare, title: 'Diary' },
  { href: '/homepage/assignments', icon: PenSquare, title: 'Assignments' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/faq', icon: HelpCircle, title: 'FAQ' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

const studentSidebar = [
  { href: '/homepage', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/homepage/my-classes', icon: BookOpen, title: 'Start Learning' },
  { href: '/homepage/diary', icon: PenSquare, title: 'Diary' },
  { href: '/homepage/assignments', icon: PenSquare, title: 'Assignments' },
  { href: '/homepage/notice-board', icon: ClipboardList, title: 'Notice Board' },
  { href: '/homepage/profile', icon: User, title: 'Profile' },
  { href: '/homepage/faq', icon: HelpCircle, title: 'FAQ' },
  { href: '/homepage/report', icon: Bug, title: 'Report' },
];

export function getSidebarNav(role: string) {
  switch (role) {
    case TENANTADMIN:
      return superAdminSidebar;
    case SCHOOLADMIN:
      return schoolAdminSidebar;
    case TEACHER:
      return teacherSidebar;
    case STUDENT:
      return studentSidebar;
    default:
      return [];
  }
}
