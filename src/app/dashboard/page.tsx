'use client';
import { useAuth } from '@/hooks/use-auth';
import SuperAdminDashboard from '@/components/dashboards/super-admin';
import SchoolAdminDashboard from '@/components/dashboards/school-admin';
import TeacherDashboard from '@/components/dashboards/teacher';
import StudentDashboard from '@/components/dashboards/student';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

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

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-96 rounded-lg" />
                <Skeleton className="h-96 rounded-lg" />
            </div>
        </div>
    )
}
