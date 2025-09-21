'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookUser, Users, Clock, ArrowRight, BookOpen, ClipboardList, Bell, Book, Calculator, Leaf } from 'lucide-react';
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

const banners = [
    { src: 'https://picsum.photos/1280/720?q=31', alt: 'banner-1', title: 'Dedicated Educators, Inspiring Futures' },
    { src: 'https://picsum.photos/1280/720?q=32', alt: 'banner-2', title: 'Empowering Students for a Brighter Tomorrow' },
    { src: 'https://picsum.photos/1280/720?q=33', alt: 'banner-3', title: 'Fostering a Love for Lifelong Learning' },
];

const subjects = [
    { name: 'English', icon: Book, color: 'text-blue-600', href: '/dashboard/english' },
    { name: 'Mathematics', icon: Calculator, color: 'text-green-600', href: '/dashboard/mathematics' },
    { name: 'EVS', icon: Leaf, color: 'text-yellow-600', href: '/dashboard/evs' },
];

export default function StudentDashboard({ user }: { user: User }) {
    const router = useRouter();
  return (
    <div className="space-y-6">
       <Carousel className="w-full" opts={{ loop: true, align: 'center' }} plugins={[Autoplay({ delay: 5000 })]}>
            <CarouselContent>
                {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                    <Card className="overflow-hidden">
 <CardContent className="relative flex w-full aspect-video items-center justify-center p-0 rounded-lg md:w-[60vw] mx-auto">
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
            <CarouselPrevious className="absolute left-4 bg-transparent border-0 text-white hover:text-gray-200" />
            <CarouselNext className="absolute right-4 bg-transparent border-0 text-white hover:text-gray-200" />
        </Carousel>

        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
                <button onClick={() => router.push('/dashboard/diary')} className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
                    <div className="inline-flex items-center justify-center rounded-full bg-blue-50 p-3">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-sm text-blue-700">Diary</div>
                </button>

                <button onClick={() => router.push('/dashboard/homework')} className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
                    <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-3">
                        <ClipboardList className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-sm text-green-700">Homework</div>
                </button>

                <button onClick={() => router.push('/dashboard/notice-board')} className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
                    <div className="inline-flex items-center justify-center rounded-full bg-yellow-50 p-3">
                        <Bell className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="text-sm text-yellow-700">Notice</div>
                </button>
            </CardContent>
        </Card>

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
