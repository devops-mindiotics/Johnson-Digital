'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlayCircle, BookOpen, Clipboard, FileText, Key, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const chapters = [
    { name: "The Magic Garden", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "My Family Tree", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Colors All Around", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Animal Friends", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Story Time", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Alphabet Adventures", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Picture Reading", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Rhyme Time", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Community Helpers", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Seasons and Weather", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
];

export default function EnglishPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="text-center flex-grow">
                    <h1 className="text-3xl font-bold">English</h1>
                    <p className="text-muted-foreground">Select a chapter to explore resources</p>
                </div>
                <div className="w-10" />
            </div>

            <div className="space-y-4">
                {chapters.map((chapter, index) => (
                    <Collapsible key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">{index + 1}</div>
                                <span className="font-semibold">{chapter.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <PlayCircle className="h-6 w-6 text-gray-400" />
                                <span className="text-sm text-gray-500">Animation Video</span>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                                {chapter.resources.map((resource) => (
                                    <div key={resource.name} className="flex flex-col items-center gap-2 rounded-md border p-4 text-center">
                                        <resource.icon className="h-8 w-8 text-gray-500" />
                                        <span className="text-sm font-medium">{resource.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}
