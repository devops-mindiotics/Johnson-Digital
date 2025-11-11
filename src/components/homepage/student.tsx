'use client';
import React, { useRef } from "react";
import Image from 'next/image';
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
import Link from "next/link";

export default function StudentDashboard({ user }: { user: User }) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const banners = [
    { src: 'https://picsum.photos/1280/720?q=31', alt: 'banner-1', title: 'Dedicated Educators, Inspiring Futures', description: 'Our experienced and passionate educators are committed to helping every student reach their full potential.' },
    { src: 'https://picsum.photos/1280/720?q=32', alt: 'banner-2', title: 'Empowering Students for a Brighter Tomorrow', description: 'We provide a supportive and challenging environment where students can develop the skills and confidence to succeed.' },
    { src: 'https://picsum.photos/1280/720?q=33', alt: 'banner-3', title: 'Fostering a Love for Lifelong Learning', description: 'Our innovative curriculum and engaging activities inspire a passion for learning that lasts a lifetime.' },
  ];

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
                {banners.map((banner, index) => (
                <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                        <CardContent className="relative flex w-full h-64 md:h-96 items-center justify-center p-0 rounded-lg mx-auto">
                            <Image src={banner.src} alt={banner.alt} fill style={{ objectFit: 'cover' }} />
                            <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center px-6 text-center pointer-events-none" />
                            <div className="relative text-center text-primary-foreground p-8 flex flex-col items-center justify-center h-full">
                                <h3 className="text-2xl md:text-4xl font-bold">{banner.title}</h3>
                                <p className="mt-2 text-sm md:text-lg max-w-xl">{banner.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/50 text-slate-100 transition-colors hover:bg-slate-900">
                <ChevronLeft className="h-6 w-6" />
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/50 text-slate-100 transition-colors hover:bg-slate-900">
                <ChevronRight className="h-6 w-6" />
            </CarouselNext>
            </Carousel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {modules.map((module) => (
                <Link href={module.href} key={module.name} className="no-underline">
                    <Card className="text-center h-full hover:shadow-lg transition-shadow relative">
                        {module.tag && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
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
