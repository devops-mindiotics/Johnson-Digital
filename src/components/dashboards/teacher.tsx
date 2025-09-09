'use client';
import React from "react";
import Image from 'next/image';
import type { User } from '@/contexts/auth-context';
import { BookUser, Users, Clock, ArrowRight, BookOpen, ClipboardList, Bell } from 'lucide-react';

export default function TeacherDashboard({ user }: { user: User }) {
  const firstName = (user?.name || 'Teacher').split(' ')[0];

  const banners = [
    { src: 'https://picsum.photos/1600/420?q=31', alt: 'banner-1', title: 'Dedicated Educators, Inspiring Futures' },
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
      {/* Top row: welcome */}






      {/* Banner */}
      <div className="w-full max-w-7xl">
        <div className="relative w-full h-52 md:h-64 rounded-lg overflow-hidden shadow">
          <Image src={banners[0].src} alt={banners[0].alt} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center px-6">
            <h3 className="text-xl md:text-3xl font-bold text-white">{banners[0].title}</h3>
          </div>
          {/* simple nav dots / arrows (visual only) */}
          <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow">
            <span className="text-sm">‹</span>
          </button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow">
            <span className="text-sm">›</span>
          </button>
        </div>
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
            <button className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-50 p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm text-blue-700">Diary</div>
            </button>

            <button className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
              <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-3">
                <ClipboardList className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm text-green-700">Homework</div>
            </button>

            <button className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
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
        © 2025 EduCentral by Johnson Digital. All Rights Reserved.
      </div>
    </div>
  );
}
