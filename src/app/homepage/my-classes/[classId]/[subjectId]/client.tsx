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
import { getSubjectContent } from "@/lib/api/contentApi";
import { getSignedUrlForViewing } from "@/lib/api/attachmentApi";
import { getAllLessons } from "@/lib/api/masterApi"; // Corrected import path
import { useAuth } from "@/hooks/use-auth";

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any;
}

const iconComponents = {
  "video/mp4": PlayCircle,
  "application/pdf": BookOpen,
  pubhtml5: BookOpen,
  default: FileText,
};

const processApiDataToChapters = (records, allLessons) => {
  if (!records || records.length === 0) return [];

  const lessonTitleMap = new Map(allLessons.map(l => [l.id, l.name]));
  const chaptersMap = new Map();

  records.forEach(record => {
    const { lesson, attachmentId, name, filename } = record;

    if (!chaptersMap.has(lesson)) {
      const title = lessonTitleMap.get(lesson) || 'Unknown Lesson';
      chaptersMap.set(lesson, { id: lesson, title: title, resources: [] });
    }

    let type = 'default';
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename.endsWith('.mp4')) {
      type = 'video/mp4';
    } else if (lowerFilename.endsWith('.pdf')) {
      type = 'application/pdf';
    }

    chaptersMap.get(lesson).resources.push({
      id: attachmentId,
      title: name,
      type: type,
    });
  });

  return Array.from(chaptersMap.values());
};

export default function LessonContentClientPage({
  classId,
  subjectId,
  subject,
}: LessonContentClientPageProps) {
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [content, setContent] = useState<any>(subject);
  const { openPdf } = usePdfViewer();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const subjectName = searchParams.get('subjectName') || subject.name;

  useEffect(() => {
    const fetchContentAndLessons = async () => {
      const seriesId = searchParams.get('seriesId');
      let packageId = searchParams.get('packageId');

      if (packageId === '') {
        packageId = 'NA';
      }

      if (user?.tenantName && seriesId && packageId) {
        try {
          const [contentResponse, lessonsResponse] = await Promise.all([
            getSubjectContent(
              user.tenantName,
              seriesId,
              packageId,
              classId,
              subjectId
            ),
            getAllLessons({ tenantId: user.tenantName }), // Corrected API call
          ]);
          
          if (contentResponse.data && contentResponse.data.records) {
            const allLessons = lessonsResponse || [];
            const newChapters = processApiDataToChapters(contentResponse.data.records, allLessons);
            setContent({ name: subjectName, chapters: newChapters });
          } else {
            setContent({ ...subject, name: subjectName });
          }
        } catch (error) {
          console.error("Failed to fetch content and lessons:", error);
          setContent({ ...subject, name: subjectName, chapters: [] });
        }
      }
    };

    fetchContentAndLessons();
  }, [classId, subjectId, user?.tenantName, searchParams, subjectName, subject]);

  const getIcon = (type: string) => {
    return iconComponents[type as keyof typeof iconComponents] || iconComponents.default;
  };

  const handleResourceClick = async (resource: any) => {
    setSelectedResource(null);
    setSelectedVideoUrl(null);

    const { id: attachmentId, type } = resource;
    const signedUrlResponse = await getSignedUrlForViewing(attachmentId);

    if (signedUrlResponse && signedUrlResponse.viewUrl) {
        const { viewUrl } = signedUrlResponse;

        if (type === 'video/mp4') {
            setSelectedVideoUrl(viewUrl);
        } else if (type === 'application/pdf') {
            openPdf(viewUrl, resource.title);
        } else if (type === 'pubhtml5') {
            setSelectedResource({ ...resource, url: viewUrl });
        } else {
            window.open(viewUrl, '_blank');
        }
    } else {
        console.error("Failed to get signed URL for", attachmentId);
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{content.name}</h1>
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

      {selectedResource && (
        <Card className="w-full flex justify-center p-4 shadow-lg border-2 border-primary">
          {selectedResource.type === "pubhtml5" && selectedResource.url ? (
            <div
              className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden aspect-video"
              dangerouslySetInnerHTML={{
                __html: `<iframe
                          style='width:100%;height:100%;border:none;'
                          src='${selectedResource.url}'
                          seamless='seamless'
                          scrolling='no'
                          frameborder='0'
                          allowtransparency='true'
                          allowfullscreen='true'>
                         </iframe>`,
              }}
            />
          ) : (
            <p className="text-center text-muted-foreground p-8">
              No preview available for this resource type.
            </p>
          )}
        </Card>
      )}

      <Accordion type="single" collapsible className="w-full space-y-4">
        {content.chapters?.map((chapter: any, index: number) => (
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
    </div>
  );
}
