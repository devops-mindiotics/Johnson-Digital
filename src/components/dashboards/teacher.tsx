'use client';
import React from "react";
import Image from 'next/image';
import type { User } from '@/contexts/auth-context';
import { BookUser, Users, Clock, ArrowRight, BookOpen, ClipboardList, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

export default function TeacherDashboard({ user }: { user: User }) {
  const router = useRouter();
  const firstName = (user?.name || 'Teacher').split(' ')[0];

  const banners = [
    { src: 'https://picsum.photos/1280/720?q=31', alt: 'banner-1', title: 'Dedicated Educators, Inspiring Futures' },
    { src: 'https://picsum.photos/1280/720?q=32', alt: 'banner-2', title: 'Empowering Students for a Brighter Tomorrow' },
    { src: 'https://picsum.photos/1280/720?q=33', alt: 'banner-3', title: 'Fostering a Love for Lifelong Learning' },
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
    <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="w-full">
        <Carousel className="w-full" opts={{ loop: true, align: 'center' }} plugins={[Autoplay({ delay: 5000 })]}>
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow md:w-[60vw] mx-auto">
                  <Image src={banner.src} alt={banner.alt} fill className="object-contain" />
                  <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center px-6 text-center">
                    <h3 className="text-xl md:text-3xl font-bold text-white">{banner.title}</h3>
                    <p className="mt-2 text-sm md:text-lg text-white/90">{banner.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 bg-transparent border-0 text-white hover:text-gray-200" />
          <CarouselNext className="absolute right-4 bg-transparent border-0 text-white hover:text-gray-200" />
        </Carousel>
      </div>

      {/* Quick menu (Diary / Homework / Notice) - full width boxed */}
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-xl shadow px-4 py-5">
          <div className="flex items-center justify-between mb-3">
            <div />
            {/* <div className="text-left whitespace-nowrap  text-black-700">Quick Access </div>
          </div> */}
          <div className="w-full ">
  <div className="text-left text-black whitespace-nowrap">
    Quick Access
  </div>
</div>
</div>
          <div className="flex gap-4">
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
          </div>
        </div>
      </div>

      {/* Classes Content - boxed and fills available width */}
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Classes-Content</h3>
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
