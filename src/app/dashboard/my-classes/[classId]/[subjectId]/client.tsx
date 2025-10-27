'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, BookOpen, Clipboard, FileText, Key, ArrowLeft, Presentation } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const iconComponents = {
    PlayCircle,
    BookOpen,
    Clipboard,
    FileText,
    Key,
    Presentation
};

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any;
}

export default function LessonContentClientPage({ classId, subjectId, subject }: LessonContentClientPageProps) {

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/my-classes/${classId}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Subjects</span>
                    </Button>
                </Link>
                <div className="text-center flex-grow">
                    <h1 className="text-3xl font-bold">{subject.name}</h1>
                    <p className="text-muted-foreground">• Select a chapter to explore resources</p>
                </div>
                <div className="w-10" /> 
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {subject.chapters.map((chapter, index) => (
                    <AccordionItem key={chapter.id} value={`item-${index}`} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <AccordionTrigger className="flex w-full items-center justify-between p-4 font-semibold text-lg no-underline hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">{index + 1}</div>
                                <span>{chapter.name}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6">
                            {chapter.resources && chapter.resources.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {chapter.resources.map((resource) => {
                                        const IconComponent = iconComponents[resource.icon];
                                        return (
                                            <Card key={resource.name} className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                                {IconComponent && <IconComponent className="h-8 w-8 text-white mb-2" />}
                                                <span className="text-sm font-medium text-center">{resource.name}</span>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground">No resources available for this chapter.</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
