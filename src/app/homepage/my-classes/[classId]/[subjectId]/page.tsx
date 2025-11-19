'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from 'next/navigation';
import LessonContentClientPage from "./client";
import { getSubjectContent } from "@/lib/api/masterApi";

export default function LessonContentPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const classId = params.classId as string;
  const subjectId = params.subjectId as string;
  const seriesId = searchParams.get('seriesId');
  const packageId = searchParams.get('packageId');
  
  const [subjectContent, setSubjectContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      if (!seriesId || !classId || !subjectId) {
          console.log("LessonContentPage: Missing required params/searchParams.", { seriesId, classId, subjectId });
          setIsLoading(false);
          setError("Missing required information to load content.");
          return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log("LessonContentPage: Fetching subject content with:", { seriesId, packageId, classId, subjectId });
        const response = await getSubjectContent(
          seriesId,
          packageId || "NA",
          classId,
          subjectId
        );

        console.log("LessonContentPage: API Response Received:", response);

        if (response && response.data && Array.isArray(response.data.records)) {
          setSubjectContent(response.data.records);
          console.log("LessonContentPage: Content state updated with records:", response.data.records);
        } else {
          console.warn("LessonContentPage: No records found in API response.", response);
          setSubjectContent([]);
        }

      } catch (err) {
        console.error("LessonContentPage: Failed to fetch subject content:", err);
        setError("Failed to load content.");
        setSubjectContent([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [seriesId, packageId, classId, subjectId]);

  if (isLoading) {
      return <div>Loading content...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  return (
    <LessonContentClientPage
      classId={classId}
      subjectId={subjectId}
      subject={subjectContent} // Pass the fetched records array
    />
  );
}
