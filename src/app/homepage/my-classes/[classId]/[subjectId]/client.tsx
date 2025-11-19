'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, BookOpen, FileText, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePdfViewer } from "@/hooks/use-pdf-viewer";
import { getSignedUrlForViewing } from "@/lib/api/attachmentApi";
import { getAllLessons } from "@/lib/api/masterApi";

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any[]; // Expecting the records array
}

const iconComponents = {
  "video/mp4": PlayCircle,
  "application/pdf": BookOpen,
  pubhtml5: BookOpen,
  default: FileText,
};

// This function processes the raw records and all lessons to create a structured chapter list.
const processApiDataToChapters = (records: any[], allLessons: any[]) => {
  if (!records || records.length === 0) {
    console.log("[Debug] processApiDataToChapters: No records to process.");
    return [];
  }
  console.log("[Debug] processApiDataToChapters: Processing records:", { records, allLessons });

  const lessonTitleMap = new Map(allLessons.map(l => [l.id, l.name]));
  const chaptersMap = new Map();

  records.forEach(record => {
    const { lesson, attachmentId, name, filename } = record;

    if (!chaptersMap.has(lesson)) {
      const title = lessonTitleMap.get(lesson) || 'Unknown Lesson';
      chaptersMap.set(lesson, { id: lesson, title: title, resources: [] });
    }

    let type = 'default';
    if (filename) { // Ensure filename is not null
        const lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith('.mp4')) {
          type = 'video/mp4';
        } else if (lowerFilename.endsWith('.pdf')) {
          type = 'application/pdf';
        }
    }

    chaptersMap.get(lesson).resources.push({
      id: attachmentId,
      title: name,
      type: type,
      filename: filename // Pass filename for debugging if needed
    });
  });

  const processedChapters = Array.from(chaptersMap.values());
  console.log("[Debug] processApiDataToChapters: Processed chapters:", processedChapters);
  return processedChapters;
};

export default function LessonContentClientPage({
  classId,
  subjectId,
  subject, // This prop now contains the records from the API
}: LessonContentClientPageProps) {

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const { openPdf } = usePdfViewer();
  const searchParams = useSearchParams();

  const subjectName = searchParams.get('subjectName') || 'Subject Content';

  // This useEffect will now only run when the `subject` prop changes.
  // It handles processing the data, not fetching it.
  useEffect(() => {
    const processContent = async () => {
      console.log("[Debug] Client Component: Received `subject` prop with records:", subject);
      if (!subject || subject.length === 0) {
        console.log("[Debug] Client Component: No records to process. Setting chapters to empty array.");
        setChapters([]);
        return;
      }

      try {
        // We still need to fetch all lessons to map lesson IDs to lesson names.
        console.log("[Debug] Client Component: Fetching all lessons to map titles.");
        const allLessons = await getAllLessons();
        console.log("[Debug] Client Component: Fetched lessons:", allLessons);
        
        // The `subject` prop (which is `subjectContent.data.records`) is passed for processing.
        const newChapters = processApiDataToChapters(subject, allLessons);
        setChapters(newChapters);
        console.log("[Debug] Client Component: Chapters state updated.", newChapters);

      } catch (error) {
        console.error("❌ LessonContentClientPage: Failed to fetch lessons or process content:", error);
        setChapters([]); // Set to empty on error
      }
    };

    processContent();
    
  }, [subject]); // Dependency array only contains `subject`

  const getIcon = (type: string) => {
    return iconComponents[type as keyof typeof iconComponents] || iconComponents.default;
  };

  const handleResourceClick = async (resource: any) => {
    setSelectedVideoUrl(null); // Reset video URL

    const { id: attachmentId, type, title } = resource;
    console.log(`[Debug] Resource clicked: ${title} (ID: ${attachmentId}, Type: ${type})`);

    try {
        const signedUrlResponse = await getSignedUrlForViewing(attachmentId);

        if (signedUrlResponse && signedUrlResponse.viewUrl) {
            const { viewUrl } = signedUrlResponse;
            console.log(`[Debug] Obtained signed URL: ${viewUrl}`);

            if (type === 'video/mp4') {
                setSelectedVideoUrl(viewUrl);
            } else if (type === 'application/pdf') {
                openPdf(viewUrl, title);
            } else {
                // Default action for other resource types
                window.open(viewUrl, '_blank');
            }
        } else {
            console.error(`❌ handleResourceClick: Failed to get signed URL for attachment: ${attachmentId}`);
        }
    } catch (error) {
        console.error(`❌ handleResourceClick: Error getting signed URL for ${attachmentId}:`, error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4 bg-background p-4 rounded-lg shadow-sm border">
        <Link href={`/homepage/my-classes`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{subjectName}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Select a chapter to explore resources
          </p>
        </div>
        <div className="w-10" />
      </div>

      {selectedVideoUrl && (
        <Card className="w-full relative p-4 shadow-lg border-2 border-primary">
          <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/50 hover:bg-white rounded-full"
              onClick={() => setSelectedVideoUrl(null)}
          >
              <X className="h-5 w-5" />
          </Button>
          <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden aspect-video">
              <video controls autoPlay className="w-full h-full rounded-lg bg-black">
                  <source src={selectedVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
              </video>
          </div>
        </Card>
      )}

      <Accordion type="single" collapsible className="w-full space-y-4">
        {chapters?.map((chapter: any, index: number) => (
          <AccordionItem
            key={chapter.id}
            value={`item-${index}`}
            className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="flex w-full items-center justify-between p-4 font-semibold text-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {index + 1}
                </div>
                <span>{chapter.title}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-6 bg-muted/20">
              {chapter.resources && chapter.resources.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {chapter.resources.map((resource: any) => {
                    const IconComponent = getIcon(resource.type);
                    return (
                      <Card
                        key={resource.id}
                        className="group flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br from-background to-muted/50 border"
                        onClick={() => handleResourceClick(resource)}
                      >
                        <IconComponent className="h-8 w-8 text-primary group-hover:text-accent-foreground transition-colors mb-2" />
                        <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                          {resource.title}
                        </span>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground p-4">
                  No resources available for this chapter.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {chapters.length === 0 && (
          <Card className="text-center py-12">
              <p>No content is available for this subject yet.</p>
              <p className="text-sm text-muted-foreground">Please check back later.</p>
          </Card>
      )}
    </div>
  );
}
