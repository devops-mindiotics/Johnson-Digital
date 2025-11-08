'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlayCircle, BookOpen, Clipboard, FileText, Key, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const chapters = [
    { name: "My Body Parts", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Plants Around Us", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Water Everywhere", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Air We Breathe", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Our Environment", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Food We Eat", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Animals and Birds", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Transport Vehicles", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Safety Rules", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
    { name: "Our Earth", resources: [ { name: "Animation Video", icon: PlayCircle }, { name: "Content Book", icon: BookOpen }, { name: "Work Book", icon: Clipboard }, { name: "Lesson Plan", icon: FileText }, { name: "Answer Key", icon: Key } ] },
];

export default function EVSPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/homepage" passHref>
                    <Button variant="outline" size="icon" aria-label="Go back to dashboard">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="text-center flex-grow">
                    <h1 className="text-2xl font-bold">EVS</h1>
                    <p className="text-muted-foreground text-sm">Select a chapter to explore resources</p>
                </div>
                <div className="w-10"></div>{/* Spacer to balance the back button */}
            </div>

            <div className="space-y-4">
                {chapters.map((chapter, index) => (
                    <Collapsible key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">{index + 1}</div>
                                <span className="font-semibold">{chapter.name}</span>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                {chapter.resources.slice(0, 5).map(resource => (
                                    <div key={resource.name} className="flex items-center gap-2 text-xs text-gray-500">
                                       <resource.icon className="h-4 w-4" />
                                       <span>{resource.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {chapter.resources.map((resource) => (
                                    <div key={resource.name} className="flex flex-col items-center gap-2 rounded-md border p-4 text-center hover:bg-gray-50 transition-colors">
                                        <resource.icon className="h-7 w-7 text-gray-500" />
                                        <span className="text-xs font-medium">{resource.name}</span>
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
