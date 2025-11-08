'use client';

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PlayCircle,
  BookOpen,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mapping of resource types to icons
const iconComponents = {
  'video/mp4': PlayCircle,
  'pubhtml5': BookOpen,
  default: FileText,
};

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any;
}

export default function LessonContentClientPage({
  classId,
  subjectId,
  subject,
}: LessonContentClientPageProps) {
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  // Function to get the correct icon for a resource
  const getIcon = (type: string) => {
    return iconComponents[type] || iconComponents.default;
  };
  
  // Hardcoded pubhtml5 URL for now as it is not in subjects.json
  const pubhtml5Url = "https://online.pubhtml5.com/wjgsx/zqjg/";

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="flex items-center gap-4">
        <Link href={`/homepage/subjects`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </Link>
        <div className="text-center flex-grow">
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-muted-foreground">
            • Select a chapter to explore resources
          </p>
        </div>
        <div className="w-24" />
      </div>

      {/* 🔹 Display Selected Resource */}
      {selectedResource && (
        <div className="w-full flex justify-center">
          {/* 🎬 VIDEO */}
          {selectedResource.type === "video/mp4" && selectedResource.url ? (
            <div className="w-[900px] h-[500px] rounded-lg overflow-hidden shadow-lg">
              <video controls autoPlay className="w-full h-full rounded-lg">
                <source src={selectedResource.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : selectedResource.type === "pubhtml5" ? (
            // 📘 PUBHTML5 PDF IFRAME VIEWER
            <div
              className="w-[900px] h-[500px] rounded-lg overflow-hidden shadow-lg"
              dangerouslySetInnerHTML={{
                __html: `<iframe 
                          style='width:900px;height:500px' 
                          src='${pubhtml5Url}'  
                          seamless='seamless' 
                          scrolling='no' 
                          frameborder='0' 
                          allowtransparency='true' 
                          allowfullscreen='true'>
                         </iframe>`,
              }}
            />
          ) : (
            <p className="text-center text-muted-foreground">
              No preview available for this resource type.
            </p>
          )}
        </div>
      )}

      {/* 🔹 Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {subject.chapters.map((chapter, index) => (
          <AccordionItem
            key={chapter.id}
            value={`item-${index}`}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <AccordionTrigger className="flex w-full items-center justify-between p-4 font-semibold text-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {index + 1}
                </div>
                <span>{chapter.title}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-6">
              {chapter.resources && chapter.resources.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {chapter.resources.map((resource) => {
                    const IconComponent = getIcon(resource.type);
                    return (
                      <Card
                        key={resource.id}
                        className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                        onClick={() =>
                          setSelectedResource(resource)
                        }
                      >
                        {IconComponent && (
                          <IconComponent className="h-8 w-8 text-white mb-2" />
                        )}
                        <span className="text-sm font-medium text-center">
                          {resource.title}
                        </span>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
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
