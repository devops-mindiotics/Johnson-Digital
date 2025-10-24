'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { DashboardSkeleton } from '@/components/ui/loader';
import { getRoles } from '@/lib/utils/getRole'; 

import SuperAdminDashboard from '@/components/dashboards/super-admin';
import SchoolAdminDashboard from '@/components/dashboards/school-admin';
import TeacherDashboard from '@/components/dashboards/teacher';
import StudentDashboard from '@/components/dashboards/student';

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

  
  const userRole = getRoles() || 'student';

   const renderDashboard = () => {
    console.log('🚀 renderDashboard called', userRole);
    switch (userRole.toLowerCase()) {
      case 'super admin':
        return <SuperAdminDashboard user={user} />;
      case 'schooladmin':
        return <SchoolAdminDashboard user={user} />;
      case 'teacher':
        return <TeacherDashboard user={user} />;
      case 'student':
        return <StudentDashboard user={user} />;
      case 'tenantadmin':
        return <SuperAdminDashboard user={user} />; // or another dashboard if needed
      default:
        console.log('🚀 Invalid user role', userRole);
        return <div>Invalid user role.</div>;
    }
  };


  return renderDashboard();

}
