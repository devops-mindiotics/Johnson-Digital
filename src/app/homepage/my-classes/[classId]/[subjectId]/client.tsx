'use client';

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, BookOpen, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePdfViewer } from "@/hooks/use-pdf-viewer"; // Import the hook

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any;
}

// Mapping of resource types to icons
const iconComponents = {
  "video/mp4": PlayCircle,
  "application/pdf": BookOpen,
  pubhtml5: BookOpen, // Or another suitable icon
  default: FileText,
};

export default function LessonContentClientPage({
  subject
}: LessonContentClientPageProps) {
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const { openPdf } = usePdfViewer(); // Use the hook

  // Function to get the correct icon for a resource
  const getIcon = (type: string) => {
    return (
      iconComponents[type as keyof typeof iconComponents] || iconComponents.default
    );
  };

  const handleResourceClick = (resource: any) => {
    if (resource.type === "application/pdf" && resource.url) {
      // Open PDF in the viewer dialog
      openPdf(resource.url, resource.title);
    } else {
      // Set other resources to be displayed inline
      setSelectedResource(resource);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 🔹 Header */}
      <div className="flex items-center gap-4 bg-background p-4 rounded-lg shadow-sm border">
        <Link href={`/homepage/my-classes`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Select a chapter to explore resources
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* 🔹 Display Selected Resource */}
      {selectedResource && (
        <Card className="w-full flex justify-center p-4 shadow-lg border-2 border-primary"> 
          {selectedResource.type === "video/mp4" && selectedResource.url ? (
            // 🎬 VIDEO
            <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden aspect-video">
              <video controls autoPlay className="w-full h-full rounded-lg bg-black">
                <source src={selectedResource.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : selectedResource.type === "pubhtml5" && selectedResource.url ? (
            // 📘 PUBHTML5 IFRAME VIEWER
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
            // Fallback for other types if any are added
            <p className="text-center text-muted-foreground p-8">
              No preview available for this resource type.
            </p>
          )}
        </Card>
      )}

      {/* 🔹 Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {subject.chapters?.map((chapter: any, index: number) => (
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
