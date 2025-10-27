'use client';
import { useAuth } from '@/hooks/use-auth';
import SuperAdminDashboard from '@/components/homepage/super-admin';
import SchoolAdminDashboard from '@/components/homepage/school-admin';
import TeacherDashboard from '@/components/homepage/teacher';
import StudentDashboard from '@/components/homepage/student';
import { DashboardSkeleton } from '@/components/ui/loader';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

   console.log('🚀 DashboardPage render', { user, isLoading });

  if (isLoading || !user) {
    console.log('🚀 DashboardPage showing skeleton/loading');
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
