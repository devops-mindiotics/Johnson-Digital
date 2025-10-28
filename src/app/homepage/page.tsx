'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { DashboardSkeleton } from '@/components/ui/loader';
import { getRoles } from '@/lib/utils/getRole'; 

import { API_BASE_URL, SUPERADMIN , SCHOOLADMIN , TENANTADMIN , TEACHER , STUDENT } from '@/lib/utils/constants';

import SuperAdminDashboard from '@/components/homepage/super-admin';
import SchoolAdminDashboard from '@/components/homepage/school-admin';
import TeacherDashboard from '@/components/homepage/teacher';
import StudentDashboard from '@/components/homepage/student';

export default function Homepage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if user not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  
  const userRole = getRoles() || STUDENT;

   const renderDashboard = () => {
    console.log('🚀 renderDashboard called', userRole);
    switch (userRole) {
      case SUPERADMIN:
        return <SuperAdminDashboard user={user} />;
      case SCHOOLADMIN:
        return <SchoolAdminDashboard user={user} />;
      case TEACHER:
        return <TeacherDashboard user={user} />;
      case STUDENT:
        return <StudentDashboard user={user} />;
      case TENANTADMIN:
        return <SuperAdminDashboard user={user} />;
      default:
        console.log('🚀 Invalid user role', userRole);
        return <div>Invalid user role.</div>;
    }
  };


  return renderDashboard();

}
