import {
    LayoutDashboard,
    Settings,
    Megaphone,
    GraduationCap,
    UserCircle,
    Image,
    School,
    FolderGit,
    BookText,
    BookOpen,
    Book,
    MonitorPlay,
    UsersRound,
    Presentation,
    Bug,
    PlaySquare,
    ShieldCheck,
    LogOut,
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
    'tenantadmin': [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'text-white',
      },
      {
        label: 'Schools',
        href: '/dashboard/schools',
        icon: School,
        color: 'text-white',
      },
      {
        label: 'Users',
        href: '/dashboard/users',
        icon: UsersRound,
        color: 'text-white',
      },
      {
        label: 'Classes',
        href: '/dashboard/classes',
        icon: Presentation,
        color: 'text-white',
      },
      {
        label: 'Content',
        href: '/dashboard/content',
        icon: MonitorPlay,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/dashboard/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
      {
        label: 'Banners',
        href: '/dashboard/banners',
        icon: Image,
        color: 'text-white',
      },
    ],
    'schooladmin': [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'text-white',
      },
      {
        label: 'School Profile',
        href: '/dashboard/school-profile',
        icon: School,
        color: 'text-white',
      },
      {
        label: 'Users',
        href: '/dashboard/users',
        icon: UsersRound,
        color: 'text-white',
      },
      {
        label: 'Classes',
        href: '/dashboard/classes',
        icon: Presentation,
        color: 'text-white',
      },
      {
        label: 'Diary',
        href: '/dashboard/diary',
        icon: BookText,
        color: 'text-white',
      },
      {
        label: 'Assignments',
        href: '/dashboard/assignments',
        icon: BookOpen,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/dashboard/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
      {
        label: 'Banners',
        href: '/dashboard/banners',
        icon: Image,
        color: 'text-white',
      },
    ],
    teacher: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'text-white',
      },
      {
        label: 'Start Learning',
        href: '/dashboard/my-classes',
        icon: Presentation,
        color: 'text-white',
      },
      {
        label: 'Diary',
        href: '/dashboard/diary',
        icon: BookText,
        color: 'text-white',
      },
      {
        label: 'Assignments',
        href: '/dashboard/assignments',
        icon: BookOpen,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/dashboard/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
    ],
    student: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'text-white',
      },
      {
        label: 'Start Learning',
        href: '/dashboard/my-classes',
        icon: Book,
        color: 'text-white',
      },
      {
        label: 'Diary',
        href: '/dashboard/diary',
        icon: BookText,
        color: 'text-white',
      },
      {
        label: 'Assignments',
        href: '/dashboard/assignments',
        icon: BookOpen,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/dashboard/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
    ],
  };
  
  export const commonMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: UserCircle,
      color: 'text-white',
    },
    {
      label: 'Report',
      href: '/dashboard/report',
      icon: Bug,
      color: 'text-white',
    },
  ];
  