"use client";

import { use, useEffect, useState } from "react";
import LessonContentClientPage from "./client";
import { getSubjectContent } from "@/lib/api/masterApi";

export default function LessonContentPage(props: {
  params: Promise<{ classId: string; subjectId: string }>;
  searchParams: Promise<{ seriesId?: string; packageId?: string }>;
}) {
  const { classId, subjectId } = use(props.params);
  const { seriesId, packageId } = use(props.searchParams);

  const [subjectContent, setSubjectContent] = useState<any>({
    name: "Loading...",
    chapters: [],
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getSubjectContent(
          seriesId || "",
          packageId || "NA",
          classId,
          subjectId
        );

        setSubjectContent(data.records);
      } catch (error) {
        console.error("Failed to fetch subject content:", error);
        setSubjectContent({ name: "Error loading content", chapters: [] });
      }
    }

    loadContent();
  }, [seriesId, packageId, classId, subjectId]);

  return (
    <LessonContentClientPage
      classId={classId}
      subjectId={subjectId}
      subject={subjectContent}
    />
  );
}
