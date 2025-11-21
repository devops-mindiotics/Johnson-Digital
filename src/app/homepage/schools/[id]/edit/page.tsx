'use client';

import { notFound, useParams } from "next/navigation";
import { getSchoolById, getAllSchools } from "@/lib/api/schoolApi";
import EditSchoolClient from "./EditSchoolClient";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// A loading skeleton for the Edit School page
function EditSchoolPageSkeleton() {
    return (
        <div className="space-y-8 p-1 md:p-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-7 w-64 mb-2" />
                        <Skeleton className="h-5 w-80" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[...Array(i === 0 ? 6 : 4)].map((_, j) => <Skeleton key={j} className="h-10 w-full" />)}
                        </div>
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end space-x-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export default function Page() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [school, setSchool] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.tenantId || !id) return;

      try {
        const [schoolData, allSchools] = await Promise.all([
          getSchoolById(user.tenantId, id),
          getAllSchools(user.tenantId),
        ]);

        if (!schoolData) {
          notFound();
          return;
        }
        
        setSchool(schoolData);
        setSchools(allSchools.records.filter(s => s.id !== id)); // Exclude the current school from the parent list
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        notFound(); // Show 404 if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, user?.tenantId]);

  if (loading) {
    return <EditSchoolPageSkeleton />;
  }

  if (!school) {
    // This will be caught by the notFound in the try-catch block, but as a fallback
    return notFound();
  }

  return <EditSchoolClient initialSchool={school} schoolList={schools} />;
}
