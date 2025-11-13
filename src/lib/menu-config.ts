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
      },
      {
        label: 'Schools',
        href: '/homepage/schools',
        icon: School,
      },
      {
        label: 'Users',
        href: '/homepage/users',
        icon: UsersRound,
      },
      {
        label: 'Classes',
        href: '/homepage/classes',
        icon: Presentation,
      },
      {
        label: 'Content',
        href: '/homepage/content',
        icon: MonitorPlay,
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
      },
      {
        label: 'Banners',
        href: '/homepage/banners',
        icon: Image,
      },
    ],
    'schooladmin': [
      {
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
      },
      {
        label: 'School Profile',
        href: '/homepage/school-profile',
        icon: School,
      },
      {
        label: 'Users',
        href: '/homepage/users',
        icon: UsersRound,
      },
      {
        label: 'Class Config',
        href: '/homepage/classes',
        icon: Presentation,
      },
      {
        label: 'Diary',
        href: '/homepage/diary',
        icon: BookText,
      },
      {
        label: 'Assignments',
        href: '/homepage/assignments',
        icon: BookOpen,
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
      },
      {
        label: 'Banners',
        href: '/homepage/banners',
        icon: Image,
      },
    ],
    teacher: [
      {
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
      },
      {
        label: 'Start Learning',
        href: '/homepage/my-classes',
        icon: Presentation,
      },
      {
        label: 'Diary',
        href: '/homepage/diary',
        icon: BookText,
      },
      {
        label: 'Assignments',
        href: '/homepage/assignments',
        icon: BookOpen,
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
      },
    ],
    student: [
      {
        label: 'homepage',
        href: '/homepage',
        icon: Layouthomepage,
      },
      {
        label: 'Start Learning',
        href: '/homepage/my-classes',
        icon: Book,
      },
      {
        label: 'Diary',
        href: '/homepage/diary',
        icon: BookText,
      },
      {
        label: 'Assignments',
        href: '/homepage/assignments',
        icon: BookOpen,
      },
      {
        label: 'Notice Board',
        href: '/homepage/notice-board',
        icon: Megaphone,
      },
    ],
  };
  
  export const commonMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      href: '/homepage/profile',
      icon: UserCircle,
    },
    {
      label: 'Report',
      href: '/homepage/report',
      icon: Bug,
    },
  ];
  