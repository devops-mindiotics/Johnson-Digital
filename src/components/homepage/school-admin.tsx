'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import Autoplay from "embla-carousel-autoplay"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/ui/accordion";
import { Users, GraduationCap, UserCheck, BookUser, Activity, MessageSquare, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '@/contexts/auth-context';

const stats = [
    { 
      title: 'Total Teachers', 
      value: '150', 
      icon: Users, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      title: 'Total Students', 
      value: '1,200', 
      icon: GraduationCap, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      title: 'Classes', 
      value: '45', 
      icon: BookUser, 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      title: 'New Admissions', 
      value: '52', 
      icon: UserCheck, 
      color: 'bg-yellow-50 text-yellow-600' 
    },
  ];

const enrollmentData = [
  { name: '2020', students: 800 },
  { name: '2021', students: 950 },
  { name: '2022', students: 1050 },
  { name: '2023', students: 1100 },
  { name: '2024', students: 1200 },
];

const genderData = [
  { name: 'Male', value: 650 },
  { name: 'Female', value: 550 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

const recentActivities = [
    { text: 'New teacher "Mrs. Smith" was added.', time: '2 hours ago', icon: Activity },
    { text: 'A new notice about the science fair was posted.', time: '5 hours ago', icon: MessageSquare },
    { text: 'Class 10 A timetable was updated.', time: '1 day ago', icon: Activity },
    { text: 'Annual fee circular was sent to all students.', time: '2 days ago', icon: MessageSquare },
];

export default function SchoolAdminDashboard({ user, banners }: { user: User; banners: any[] }) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
      )
    const [isNoticeBoardOpen, setIsNoticeBoardOpen] = useState(false);

    const school = user.schools.find(s => s.id === user.schoolId);
    const schoolName = school ? school.schoolName : '';

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardContent className="p-0">
                        <Carousel 
                            plugins={[plugin.current]}
                            className="w-full"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}>
                            <CarouselContent>
                                {Array.isArray(banners) && banners.map((banner, index) => (
                                <CarouselItem key={index}>
                                    <a href={banner.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                    <div className="relative h-48 sm:h-64 lg:h-80">
                                    <img src={banner.attachmentUrl} alt={banner.title} className="w-full h-full object-contain" />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-4">
                                        {/* <h2 className="text-white text-lg font-bold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>{banner.title}</h2> */}
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
                    </CardContent>
                </Card>
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

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Student Enrollment Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                        <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Student Gender Ratio</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie data={genderData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
