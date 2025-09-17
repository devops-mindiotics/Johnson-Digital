'use client';
import { useAuth } from '@/hooks/use-auth';
import SuperAdminDashboard from '@/components/dashboards/super-admin';
import SchoolAdminDashboard from '@/components/dashboards/school-admin';
import TeacherDashboard from '@/components/dashboards/teacher';
import StudentDashboard from '@/components/dashboards/student';
import { DashboardSkeleton } from '@/components/ui/loader';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  const renderDashboard = () => {
    switch (user.role) {
        case 'Super Admin':
          return <SuperAdminDashboard user={user} />;
        case 'School Admin':
          return <SchoolAdminDashboard user={user} />;
        case 'Teacher':
          return <TeacherDashboard user={user} />;
        case 'Student':
          return <StudentDashboard user={user} />;
        default:
          return <div>Invalid user role.</div>;
      }
  }

  return renderDashboard();
}
