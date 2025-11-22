'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from 'next/navigation';
import LessonContentClientPage from "./client";
import { getSubjectContent, getAllLessons } from "@/lib/api/masterApi";
import { useAuth } from "@/hooks/use-auth";

export default function LessonContentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();

  const classId = params.classId as string;
  const subjectId = params.subjectId as string;
  const seriesId = searchParams.get('seriesId');
  const packageId = searchParams.get('packageId');
  
  const [subjectContent, setSubjectContent] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      if (!seriesId || !classId || !subjectId || !authUser) {
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const [contentResponse, lessonsResponse] = await Promise.all([
            getSubjectContent(seriesId, packageId || "NA", classId, subjectId),
            getAllLessons(authUser.token, authUser.tenantId, authUser.schoolId)
        ]);

        console.log("Content API Response:", contentResponse);
        console.log("Lessons API Response:", lessonsResponse);

        if (contentResponse && contentResponse.data && Array.isArray(contentResponse.data.records)) {
          setSubjectContent(contentResponse.data.records);
        } else {
          console.warn("No records found in content API response.", contentResponse);
          setSubjectContent([]);
        }

        // Corrected the path to the lessons array
        if (lessonsResponse && Array.isArray(lessonsResponse.lessons)) {
            setLessons(lessonsResponse.lessons);
        } else {
            console.warn("No lessons found in API response at expected path.", lessonsResponse);
            setLessons([]);
        }

      } catch (err) {
        console.error("Failed to fetch page data:", err);
        setError("Failed to load content.");
        setSubjectContent([]);
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [seriesId, packageId, classId, subjectId, authUser]);

  if (isLoading) {
      return <div className="text-center py-12">Loading content...</div>;
  }

  if (error) {
      return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <LessonContentClientPage
      classId={classId}
      subjectId={subjectId}
      subject={subjectContent}
      lessons={lessons}
    />
  );
}
