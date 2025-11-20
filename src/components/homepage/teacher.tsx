'use client';
import Link from 'next/link';
import React, { useRef, useState } from "react";
import type { User } from '@/contexts/auth-context';
import { BookOpen, ClipboardList, Bell, ChevronLeft, ChevronRight, PlaySquare, Activity, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/ui/accordion";
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils";

const recentActivities = [
    { text: 'New teacher "Mrs. Smith" was added.', time: '2 hours ago', icon: Activity },
    { text: 'A new notice about the science fair was posted.', time: '5 hours ago', icon: MessageSquare },
    { text: 'Class 10 A timetable was updated.', time: '1 day ago', icon: Activity },
    { text: 'Annual fee circular was sent to all students.', time: '2 days ago', icon: MessageSquare },
];

export default function TeacherDashboard({ user, banners }: { user: User; banners: any[] }) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )
  const [isNoticeBoardOpen, setIsNoticeBoardOpen] = useState(false);

  const school = user.schools.find(s => s.id === user.schoolId);
  const schoolName = school ? school.schoolName : '';

  const modules = [
    { name: 'Start Learning', icon: PlaySquare, color: 'text-blue-600', href: '/homepage/my-classes' },
    { name: 'Diary', icon: BookOpen, color: 'text-green-600', href: '/homepage/diary', tag: 'Upcoming' },
    { name: 'Assignments', icon: ClipboardList, color: 'text-yellow-600', href: '/homepage/assignments', tag: 'Upcoming' },
  ];

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Carousel 
                    className="w-full"
                    opts={{ loop: true, align: 'center' }} 
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                <CarouselContent>
                    {Array.isArray(banners) && banners.map((banner, index) => (
                    <CarouselItem key={index}>
                        <a href={banner.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            <div className="relative h-48 sm:h-64 lg:h-80">
                            <img src={banner.attachmentUrl} alt={banner.title} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-4">
                                {/** <h2 className="text-white text-lg font-bold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>{banner.title}</h2> */}
                                <p className="text-white text-xs text-right" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>{schoolName}</p>
                            </div>
                            </div>
                        </a>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/50 text-slate-100 transition-colors hover:bg-slate-900">
                    <ChevronLeft className="h-6 w-6" />
                </CarouselPrevious>
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/50 text-slate-100 transition-colors hover:bg-slate-900">
                    <ChevronRight className="h-6 w-6" />
                </CarouselNext>
                </Carousel>
            </div>
            <div className="lg:hidden relative">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
                    Upcoming
                </div>
                <Accordion type="single" collapsible className="w-full" onValueChange={(value) => setIsNoticeBoardOpen(!!value)}>
                    <AccordionItem value="item-1" className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 data-[state=open]:pb-2">
                            <div className="flex flex-col items-start text-left w-full">
                                <h3 className="text-lg font-semibold">Notice Board</h3>
                                {!isNoticeBoardOpen && recentActivities.length > 0 && (
                                    <p className="text-sm text-muted-foreground truncate pr-2 mt-1">
                                        {recentActivities[0].text}
                                    </p>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                            <div className="space-y-4 pt-2 border-t">
                                {recentActivities.slice(0, 2).map(activity => (
                                    <div key={activity.text} className="flex items-start gap-4">
                                        <div className="bg-muted p-2 rounded-full">
                                            <activity.icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm">{activity.text}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-right">
                                <Link href="/homepage/notice-board" className="text-sm font-medium text-primary hover:underline">
                                    Read more...
                                </Link>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <Card className="hidden lg:flex lg:flex-col relative">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    Upcoming
                </div>
                <CardHeader>
                    <CardTitle>Notice Board</CardTitle>
                    <CardDescription>Recent activities in the school.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="space-y-4">
                        {recentActivities.slice(0, 2).map(activity => (
                            <div key={activity.text} className="flex items-start gap-4">
                                <div className="bg-muted p-2 rounded-full">
                                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm">{activity.text}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="py-2 px-4 sm:py-3 sm:px-6">
                    <Link href="/homepage/notice-board" className="text-sm font-medium text-primary hover:underline w-full text-right">
                        Read more...
                    </Link>
                </CardFooter>
            </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((module) => (
                <Link href={module.href} key={module.name} className="no-underline">
                    <Card className="text-center h-full hover:shadow-lg transition-shadow relative">
                        {module.tag && (
                            <div className={cn(
                                "absolute top-0 right-0 text-white text-xs font-bold px-2 py-1 rounded-bl-lg",
                                module.tag === 'Upcoming' && 'bg-gradient-to-r from-pink-500 to-red-500'
                            )}>
                                {module.tag}
                            </div>
                        )}
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <module.icon className={`h-10 w-10 mb-4 ${module.color}`} />
                            <h3 className="text-lg font-semibold">{module.name}</h3>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
