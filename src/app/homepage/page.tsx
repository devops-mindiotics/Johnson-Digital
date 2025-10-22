'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { DashboardSkeleton } from '@/components/ui/loader';

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

  
 const userRole = (user as any).role || 'Student'; // fallback to Student if role is missing

  const renderDashboard = () => {
    console.log('🚀 renderDashboard called', userRole);
    switch (userRole) {
      case 'Super Admin':
        return <SuperAdminDashboard user={user} />;
      case 'School Admin':
        return <SchoolAdminDashboard user={user} />;
      case 'Teacher':
        return <TeacherDashboard user={user} />;
      case 'Student':
        return <StudentDashboard user={user} />;
      default:
        console.log('🚀 Invalid user role', userRole);
        return <div>Invalid user role.</div>;
    }
  };


  return renderDashboard();

}
