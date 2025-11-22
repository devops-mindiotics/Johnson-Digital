'use client';

import { useState, useEffect, useMemo } from "react";
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
import { getSignedViewUrl } from "@/lib/api/attachmentApi";

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any[];
  lessons: any[];
}

const iconComponents = {
  "video/mp4": PlayCircle,
  "application/pdf": BookOpen,
  pubhtml5: BookOpen,
  default: FileText,
};

const processApiDataToChapters = (records: any[], allLessons: any[]) => {
  if (!records || !allLessons) {
    return [];
  }

  const lessonTitleMap = new Map(allLessons.map(l => [l.id, l.name]));
  const chaptersMap = new Map();

  records.forEach(record => {
    const { lesson, attachmentId, name, filename } = record;

    if (!chaptersMap.has(lesson)) {
      const title = lessonTitleMap.get(lesson) || 'Unknown Lesson';
      chaptersMap.set(lesson, { id: lesson, title: title, resources: [] });
    }

    let type = 'default';
    if (filename) {
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
      filename: filename
    });
  });

  return Array.from(chaptersMap.values());
};

export default function LessonContentClientPage({
  classId,
  subjectId,
  subject,
  lessons,
}: LessonContentClientPageProps) {

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const { openPdf } = usePdfViewer();
  const searchParams = useSearchParams();

  const subjectName = searchParams.get('subjectName') || 'Subject Content';

  const chapters = useMemo(() => processApiDataToChapters(subject, lessons), [subject, lessons]);

  const getIcon = (type: string) => {
    return iconComponents[type as keyof typeof iconComponents] || iconComponents.default;
  };

 const handleResourceClick = async (resource: any) => {
    setSelectedVideoUrl(null);

    const { id: attachmentId, type, title } = resource;

    try {
        const signedUrlResponse = await getSignedViewUrl(attachmentId);

        if (signedUrlResponse && signedUrlResponse.viewUrl) {
            const signedUrl = signedUrlResponse.viewUrl;

            if (type === 'video/mp4') {
                setSelectedVideoUrl(signedUrl);
            } else if (type === 'application/pdf') {
                openPdf(signedUrl, title);
            } else {
                window.open(signedUrl, '_blank');
            }
        } else {
            console.error(`❌ handleResourceClick: Failed to get signed URL for attachment: ${attachmentId}`);
        }
    } catch (error) {
        console.error(`❌ handleResourceClick: Error getting signed URL for ${attachmentId}:`, error);
    }
 };

  return (
    <div className="space-y-4 p-2 md:p-4">
      <div className="flex items-center gap-4 bg-background p-2 rounded-lg shadow-sm border">
        <Link href={`/homepage/my-classes`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-3 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{subjectName}</h1>
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
