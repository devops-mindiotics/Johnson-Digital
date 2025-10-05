'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/contexts/auth-context';
import { BookOpen, ClipboardList, Bell, Book, Calculator, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Autoplay from "embla-carousel-autoplay"
import React, { useRef } from 'react';

const banners = [
    { src: 'https://picsum.photos/1280/720?q=31', alt: 'banner-1', title: 'Dedicated Educators, Inspiring Futures', description: 'Our experienced and passionate educators are committed to helping every student reach their full potential.' },
    { src: 'https://picsum.photos/1280/720?q=32', alt: 'banner-2', title: 'Empowering Students for a Brighter Tomorrow', description: 'We provide a supportive and challenging environment where students can develop the skills and confidence to succeed.' },
    { src: 'https://picsum.photos/1280/720?q=33', alt: 'banner-3', title: 'Fostering a Love for Lifelong Learning', description: 'Our innovative curriculum and engaging activities inspire a passion for learning that lasts a lifetime.' },
];

const subjects = [
    { name: 'English', icon: Book, color: 'text-blue-600', href: '/dashboard/english' },
    { name: 'Mathematics', icon: Calculator, color: 'text-green-600', href: '/dashboard/mathematics' },
    { name: 'EVS', icon: Leaf, color: 'text-yellow-600', href: '/dashboard/evs' },
];

export default function StudentDashboard({ user }: { user: User }) {
    const router = useRouter();
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
      )
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

            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                        <button onClick={() => router.push('/dashboard/diary')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-md hover:bg-gray-50 transition border">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <div className="text-sm font-semibold text-blue-700">Diary</div>
                        </button>

                        <button onClick={() => router.push('/dashboard/homework')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-md hover:bg-gray-50 transition border">
                            <ClipboardList className="h-6 w-6 text-green-600" />
                            <div className="text-sm font-semibold text-green-700">Assignments</div>
                        </button>

                        <button onClick={() => router.push('/dashboard/notice-board')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-md hover:bg-gray-50 transition border">
                            <Bell className="h-6 w-6 text-yellow-600" />
                            <div className="text-sm font-semibold text-yellow-700">Notice</div>
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="text-center">
            <h2 className="text-2xl font-bold">Nursery</h2>
            <p className="text-muted-foreground">Choose a subject to continue learning</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {subjects.map((subject) => (
                <Link href={subject.href} key={subject.name} className="no-underline">
                    <Card className="text-center h-full hover:shadow-lg transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <subject.icon className={`h-10 w-10 mb-4 ${subject.color}`} />
                            <h3 className="text-lg font-semibold">{subject.name}</h3>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
