'use client';
import Link from 'next/link';
import React, { useRef } from "react";
import type { User } from '@/contexts/auth-context';
import { BookOpen, ClipboardList, Bell, ChevronLeft, ChevronRight, PlaySquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils";

export default function StudentDashboard({ user, banners }: { user: User; banners: any[] }) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const school = user.schools.find(s => s.id === user.schoolId);
  const schoolName = school ? school.schoolName : '';

  const modules = [
    { name: 'Start Learning', icon: PlaySquare, color: 'text-blue-600', href: '/homepage/my-classes' },
    { name: 'Diary', icon: BookOpen, color: 'text-green-600', href: '/homepage/diary', tag: 'Upcoming' },
    { name: 'Assignments', icon: ClipboardList, color: 'text-yellow-600', href: '/homepage/assignments', tag: 'Upcoming' },
    { name: 'Notice', icon: Bell, color: 'text-red-600', href: '/homepage/notice-board', tag: 'Upcoming' },
  ];

  return (
    <div className="space-y-6">
        <div className="w-full">
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
                        <div className="relative h-80">
                        <img src={banner.attachmentUrl} alt={banner.title} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-4">
                            <h2 className="text-white text-lg font-bold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>{banner.title}</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
