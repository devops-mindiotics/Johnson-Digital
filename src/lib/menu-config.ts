import {
    LayoutDashboard as Layouthomepage,
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
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
        color: 'text-white',
      },
      {
        label: 'Schools',
        href: '/homepage/schools',
        icon: School,
        color: 'text-white',
      },
      {
        label: 'Users',
        href: '/homepage/users',
        icon: UsersRound,
        color: 'text-white',
      },
      {
        label: 'Classes',
        href: '/homepage/classes',
        icon: Presentation,
        color: 'text-white',
      },
      {
        label: 'Content',
        href: '/homepage/content',
        icon: MonitorPlay,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
      {
        label: 'Banners',
        href: '/homepage/banners',
        icon: Image,
        color: 'text-white',
      },
    ],
    'schooladmin': [
      {
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
        color: 'text-white',
      },
      {
        label: 'School Profile',
        href: '/homepage/school-profile',
        icon: School,
        color: 'text-white',
      },
      {
        label: 'Users',
        href: '/homepage/users',
        icon: UsersRound,
        color: 'text-white',
      },
      {
        label: 'Class Config',
        href: '/homepage/classes',
        icon: Presentation,
        color: 'text-white',
      },
      {
        label: 'Diary',
        href: '/homepage/diary',
        icon: BookText,
        color: 'text-white',
      },
      {
        label: 'Assignments',
        href: '/homepage/assignments',
        icon: BookOpen,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
      {
        label: 'Banners',
        href: '/homepage/banners',
        icon: Image,
        color: 'text-white',
      },
    ],
    teacher: [
      {
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
        color: 'text-white',
      },
      {
        label: 'Start Learning',
        href: '/homepage/my-classes',
        icon: Presentation,
        color: 'text-white',
      },
      {
        label: 'Diary',
        href: '/homepage/diary',
        icon: BookText,
        color: 'text-white',
      },
      {
        label: 'Assignments',
        href: '/homepage/assignments',
        icon: BookOpen,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
    ],
    student: [
      {
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
        color: 'text-white',
      },
      {
        label: 'Start Learning',
        href: '/homepage/my-classes',
        icon: Book,
        color: 'text-white',
      },
      {
        label: 'Diary',
        href: '/homepage/diary',
        icon: BookText,
        color: 'text-white',
      },
      {
        label: 'Assignments',
        href: '/homepage/assignments',
        icon: BookOpen,
        color: 'text-white',
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
        color: 'text-white',
      },
    ],
  };
  
  export const commonMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      href: '/homepage/profile',
      icon: UserCircle,
      color: 'text-white',
    },
    {
      label: 'Report',
      href: '/homepage/report',
      icon: Bug,
      color: 'text-white',
    },
  ];
  