'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { BookOpen, ClipboardList, Bell, Calculator, Leaf, ArrowRight } from 'lucide-react';

import { BookUser, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";

const banners = [
    { 
        src: "https://picsum.photos/1200/400?q=31", 
        alt: "Annual Science Fair", 
        dataAiHint: "science fair project",
        title: "Dedicated Educators, Inspiring Futures",
        description: ""
    },
    { 
        src: "https://picsum.photos/1200/400?q=32", 
        alt: "Sports Day",
        dataAiHint: "school sports race",
        title: "A good teacher can inspire hope, ignite imagination, and instill love for learning.",
        description: ""
    },
    { 
        src: "https://picsum.photos/1200/400?q=33", 
        alt: "Mid-term exams",
        dataAiHint: "students writing exam",
        title: "Together for Student Success",
        description: "Your "
    },
];
const summaryStats = [
    { title: 'Assigned Classes', value: '4', icon: BookUser },
    { title: 'Total Students', value: '125', icon: Users },
];

const todaySchedule = [
    { time: '09:00 AM - 10:00 AM', class: 'Class 10A - Mathematics' },
    { time: '11:00 AM - 12:00 PM', class: 'Class 9B - History' },
    { time: '01:00 PM - 02:00 PM', class: 'Class 10A - Mathematics' },
];

const pendingSubmissions = [
    { student: 'Olivia Smith', subject: 'Mathematics', assignment: 'Algebra II Worksheet'},
    { student: 'Noah Williams', subject: 'History', assignment: 'Roman Empire Essay'},
    { student: 'Emma Brown', subject: 'Mathematics', assignment: 'Algebra II Worksheet'},
];

export default function TeacherDashboard({ user }: { user: User }) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Chapter list UI for English (recreates pasted design, no routing)
  const renderEnglishChapters = () => {
    const englishChapters = [
      "The Magic Garden",
      "My Family Tree",
      "Colors All Around",
      "Animal Friends",
      "Story Time",
      "Alphabet Adventures",
      "Picture Reading",
      "Rhyme Time",
      "Community Helpers",
      "Seasons and Weather",
    ];

    return (
      <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center py-10">
        <div className="flex w-full max-w-4xl items-center mb-6 gap-3 px-2">
          <button
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 text-gray-700 flex items-center"
            onClick={() => setSelectedSubject(null)}
          >
            ← Back
          </button>
          <button
            className="ml-auto px-3 py-1 rounded border bg-white hover:bg-gray-100 text-gray-700"
            onClick={() => { setSelectedSubject(null); setSelectedClass(null); }}
          >
            Home
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-1">English</h1>
        <p className="text-md text-gray-500 mb-8">Nursery • Select a chapter to explore resources</p>

        <div className="flex flex-col gap-4 w-full px-4">
          <div className="w-full max-w-2xl mx-auto">
            {englishChapters.map((chapter, idx) => (
              <button
                key={chapter}
                className="flex items-center justify-between bg-white rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition w-full mb-3"
                type="button"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-blue-50 text-blue-700 font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-base md:text-lg text-left">{chapter}</span>
                </div>
                <ArrowRight className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-8">Click on any chapter to expand and see available learning resources</div>
      </div>
    );
  };

  // Chapter list UI for Mathematics (new)
  const renderMathematicsChapters = () => {
    const mathChapters = [
      "Numbers 1-20",
      "Shapes and Patterns",
      "Addition Fun",
      "Subtraction Games",
      "Counting Objects",
      "Big and Small",
      "Time and Clock",
      "Money Matters",
      "Measurement Basics",
      "Simple Geometry",
    ];

    return (
      <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center py-10">
        <div className="flex w-full max-w-4xl items-center mb-6 gap-3 px-2">
          <button
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 text-gray-700 flex items-center"
            onClick={() => setSelectedSubject(null)}
          >
            ← Back
          </button>
          <button
            className="ml-auto px-3 py-1 rounded border bg-white hover:bg-gray-100 text-gray-700"
            onClick={() => { setSelectedSubject(null); setSelectedClass(null); }}
          >
            Home
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-1">Mathematics</h1>
        <p className="text-md text-gray-500 mb-8">Nursery • Select a chapter to explore resources</p>

        <div className="flex flex-col gap-4 w-full px-4">
          <div className="w-full max-w-2xl mx-auto">
            {mathChapters.map((chapter, idx) => (
              <button
                key={chapter}
                className="flex items-center justify-between bg-white rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition w-full mb-3"
                type="button"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-blue-50 text-blue-700 font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-base md:text-lg text-left">{chapter}</span>
                </div>
                <ArrowRight className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-8">Click on any chapter to expand and see available learning resources</div>
      </div>
    );
  };

  // Subject selection UI (hook subject click to state)
  const renderSubjectSelection = (grade: string) => (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-2 capitalize">{grade.replace("-", " ")}</h1>
      <p className="text-lg text-gray-500 mb-8">Choose a subject to continue learning</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
        <div
          className="flex flex-col items-center bg-white rounded-xl p-8 shadow hover:bg-blue-50 transition cursor-pointer"
          onClick={() => setSelectedSubject("English")}
          role="button"
        >
          <BookOpen className="h-10 w-10 text-blue-500 mb-4" />
          <span className="text-xl font-semibold mb-2">English</span>
          <span className="block w-12 h-1 bg-blue-400 rounded-full mt-2" />
        </div>
        <div
          className="flex flex-col items-center bg-white rounded-xl p-8 shadow hover:bg-blue-50 transition cursor-pointer"
          onClick={() => setSelectedSubject("Mathematics")}
          role="button"
        >
          <Calculator className="h-10 w-10 text-blue-500 mb-4" />
          <span className="text-xl font-semibold mb-2">Mathematics</span>
          <span className="block w-12 h-1 bg-blue-400 rounded-full mt-2" />
        </div>
        <div
          className="flex flex-col items-center bg-white rounded-xl p-8 shadow hover:bg-blue-50 transition cursor-pointer"
          onClick={() => setSelectedSubject("EVS")}
          role="button"
        >
          <Leaf className="h-10 w-10 text-blue-500 mb-4" />
          <span className="text-xl font-semibold mb-2">EVS</span>
          <span className="block w-12 h-1 bg-blue-400 rounded-full mt-2" />
        </div>
      </div>
      <button
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        onClick={() => setSelectedClass(null)}
      >
        Back to Classes
      </button>
    </div>
  );

  // Main render
  return (
    <div className="space-y-6">
      {selectedSubject === "English"
        ? renderEnglishChapters()
        : selectedSubject === "Mathematics"
        ? renderMathematicsChapters()
        : selectedClass
        ? renderSubjectSelection(selectedClass)
        : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h2>
            </div>

            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {banners.map((banner, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <CardContent className="relative flex aspect-[3/1] items-center justify-center p-0 rounded-lg">
                        <Image src={banner.src} alt={banner.alt} fill style={{ objectFit: 'cover' }} data-ai-hint={banner.dataAiHint} />
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="relative text-center text-primary-foreground p-8">
                          <h3 className="text-2xl md:text-4xl font-bold">{banner.title}</h3>
                          <p className="mt-2 text-sm md:text-lg max-w-xl">{banner.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4" />
              <CarouselNext className="absolute right-4" />
            </Carousel>

            {/* Diary, Homework, Notice icon bar */}
            <nav className="flex w-full justify-between gap-2 px-2 py-2 bg-white shadow rounded-lg max-w-7xl mx-auto">
              <button className="flex-1 flex flex-col items-center py-2 rounded-lg active:bg-blue-50">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 mb-1">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </span>
                <span className="text-xs font-medium text-blue-700">Diary</span>
              </button>
              <button className="flex-1 flex flex-col items-center py-2 rounded-lg active:bg-green-50">
                <span className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-1">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </span>
                <span className="text-xs font-medium text-green-700">Homework</span>
              </button>
              <button className="flex-1 flex flex-col items-center py-2 rounded-lg active:bg-yellow-50">
                <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-3 mb-1">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </span>
                <span className="text-xs font-medium text-yellow-700">Notice</span>
              </button>
            </nav>

            {/* Classes Content as a box container that fills available width */}
            <div className="w-full mt-4">
              <div className="bg-white shadow rounded-lg p-6 w-full max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Classes Content</h3>
                  <div className="text-sm text-gray-500">Select a class</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
                  {[
                    { label: "Nursery", icon: "🌱" },
                    { label: "LKG", icon: "🌟" },
                    { label: "UKG", icon: "🎨" },
                    { label: "Grade 1", icon: "📚" },
                    { label: "Grade 2", icon: "✏️" },
                    { label: "Grade 3", icon: "🔢" },
                    { label: "Grade 4", icon: "🧮" },
                    { label: "Grade 5", icon: "🎓" },
                  ].map((cls) => (
                    <button
                      key={cls.label}
                      onClick={() => setSelectedClass(cls.label)}
                      className="w-full h-36 flex flex-col items-center justify-center gap-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <span className="text-3xl">{cls.icon}</span>
                      <span className="text-sm text-gray-700">{cls.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}
