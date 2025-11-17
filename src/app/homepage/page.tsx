'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { getRoles } from '@/lib/utils/getRole';
import { getBanners } from '@/lib/api/bannerApi';
import { API_BASE_URL, SUPERADMIN , SCHOOLADMIN , TENANTADMIN , TEACHER , STUDENT } from '@/lib/utils/constants';

import SuperAdminDashboard from '@/components/homepage/super-admin';
import SchoolAdminDashboard from '@/components/homepage/school-admin';
import TeacherDashboard from '@/components/homepage/teacher';
import StudentDashboard from '@/components/homepage/student';

export default function Homepage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchBanners = async () => {
      if (user) {
        try {
          const bannerData = await getBanners(user.tenantId, {
            schoolId: user.schoolId,
            role: getRoles(),
          });
          setBanners(bannerData.data);
        } catch (error) {
          console.error("Failed to fetch banners:", error);
        }
      }
    };
    fetchBanners();
  }, [user]);

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
        return <SchoolAdminDashboard user={user} banners={banners} />;
      case TEACHER:
        return <TeacherDashboard user={user} banners={banners} />;
      case STUDENT:
        return <StudentDashboard user={user} banners={banners} />;
      case TENANTADMIN:
        return <SuperAdminDashboard user={user} />;
      default:
        console.log('🚀 Invalid user role', userRole);
        return <div>Invalid user role.</div>;
    }
  };

  return renderDashboard();
}
