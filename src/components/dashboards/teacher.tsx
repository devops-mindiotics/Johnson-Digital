'use client';
import React, { useRef } from "react";
import Image from 'next/image';
import type { User } from '@/contexts/auth-context';
import { BookUser, Users, Clock, ArrowRight, BookOpen, ClipboardList, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

export default function TeacherDashboard({ user }: { user: User }) {
  const router = useRouter();
  const firstName = (user?.name || 'Teacher').split(' ')[0];
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const banners = [
    { src: 'https://picsum.photos/1280/720?q=31', alt: 'banner-1', title: 'Dedicated Educators, Inspiring Futures', description: 'Our experienced and passionate educators are committed to helping every student reach their full potential.' },
    { src: 'https://picsum.photos/1280/720?q=32', alt: 'banner-2', title: 'Empowering Students for a Brighter Tomorrow', description: 'We provide a supportive and challenging environment where students can develop the skills and confidence to succeed.' },
    { src: 'https://picsum.photos/1280/720?q=33', alt: 'banner-3', title: 'Fostering a Love for Lifelong Learning', description: 'Our innovative curriculum and engaging activities inspire a passion for learning that lasts a lifetime.' },
  ];

  const classes = [
    { label: "Nursery", icon: "🌱" },
    { label: "LKG", icon: "🌟" },
    { label: "UKG", icon: "🎨" },
    { label: "Grade 1", icon: "📚" },
    { label: "Grade 2", icon: "✏️" },
    { label: "Grade 3", icon: "🔢" },
    { label: "Grade 4", icon: "🧮" },
    { label: "Grade 5", icon: "🎓" },
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

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <button onClick={() => router.push('/dashboard/diary')} className="flex items-center gap-4 p-4 rounded-md hover:bg-gray-50 transition border">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 p-3">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-sm font-semibold text-blue-700">Diary</div>
                    </button>

                    <button onClick={() => router.push('/dashboard/homework')} className="flex items-center gap-4 p-4 rounded-md hover:bg-gray-50 transition border">
                        <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-3">
                            <ClipboardList className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-sm font-semibold text-green-700">Homework</div>
                    </button>

                    <button onClick={() => router.push('/dashboard/notice-board')} className="flex items-center gap-4 p-4 rounded-md hover:bg-gray-50 transition border">
                        <div className="inline-flex items-center justify-center rounded-full bg-yellow-50 p-3">
                            <Bell className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="text-sm font-semibold text-yellow-700">Notice</div>
                    </button>
                </CardContent>
            </Card>
        </div>

      {/* Classes Content - boxed and fills available width */}
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Subjects</h3>
            <div className="text-sm text-gray-500">Select a class</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {classes.map((c) => (
              <button
                key={c.label}
                type="button"
                className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition"
                aria-label={c.label}
              >
                <span className="text-4xl">{c.icon}</span>
                <span className="text-sm text-gray-700">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / small note */}
      <div className="w-full max-w-7xl text-center text-xs text-gray-400">
      <p className="hidden md:block">  © 2025 EduCentral by Johnson Digital. All Rights Reserved.</p>
      </div>
    </div>
  );
}
