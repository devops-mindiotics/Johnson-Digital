'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getSchoolById } from '@/lib/api/schoolApi';
import ViewSchoolClient from './ViewSchoolClient';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// A more fitting skeleton for the View School page
function ViewSchoolPageSkeleton() {
    return (
        <div className="space-y-6 p-1 md:p-4 bg-gray-50/50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex items-center">
                            <Skeleton className="h-20 w-20 rounded-full mr-4" />
                            <div>
                                <Skeleton className="h-8 w-64 mb-2" />
                                <Skeleton className="h-6 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><Skeleton className="h-7 w-32" /></CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ViewSchoolPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.tenantId || !id) {
      return;
    }

    async function fetchSchoolData() {
      setLoading(true);
      try {
        const schoolData = await getSchoolById(user.tenantId, id);
        setSchool(schoolData);
      } catch (error) {
        console.error("Failed to fetch school data:", error);
        setSchool(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolData();
  }, [id, user?.tenantId]);

  if (loading) {
    return <ViewSchoolPageSkeleton />;
  }

  if (!school) {
    return notFound();
  }

  return <ViewSchoolClient school={school} />;
}
