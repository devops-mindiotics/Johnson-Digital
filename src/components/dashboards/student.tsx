
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Book, CheckCircle, Clock, Megaphone } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';

const banners = [
    { 
        src: "https://picsum.photos/1200/400?q=31", 
        alt: "Annual Science Fair", 
        dataAiHint: "science fair project",
        title: "Annual Science Fair is Here!",
        description: "Showcase your amazing projects. Submissions open until Aug 25th."
    },
    { 
        src: "https://picsum.photos/1200/400?q=32", 
        alt: "Sports Day",
        dataAiHint: "school sports race",
        title: "Get Ready for Sports Day!",
        description: "Join us for a day of fun, games, and friendly competition on September 5th."
    },
    { 
        src: "https://picsum.photos/1200/400?q=33", 
        alt: "Mid-term exams",
        dataAiHint: "students writing exam",
        title: "Mid-Term Exams Approaching",
        description: "Your mid-term exam schedule has been posted. Check the notice board for details."
    },
];

const summaryCards = [
    { title: 'Pending Assignments', value: '3', icon: Book, color: 'text-orange-500' },
    { title: 'Recent Results', value: '2', icon: CheckCircle, color: 'text-green-500' },
];

const upcomingClasses = [
    { time: '09:00 AM', subject: 'Mathematics' },
    { time: '10:00 AM', subject: 'History' },
    { time: '11:00 AM', subject: 'Science Lab' },
];

const recentNotices = [
    { title: 'Annual Sports Day Postponed', date: 'Aug 15' },
    { title: 'Parent-Teacher Meeting Schedule', date: 'Aug 12' },
];

export default function StudentDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Welcome back, {user.name.split(' ')[0]}!</CardTitle>
                    <CardDescription>Here's a snapshot of your academic progress.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Course Completion</span>
                            <span>65%</span>
                        </div>
                        <Progress value={65} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {summaryCards.map(card => (
                            <div key={card.title} className="flex items-center gap-4 p-4 rounded-lg bg-background">
                                <card.icon className={`h-8 w-8 ${card.color}`} />
                                <div>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                    <p className="text-sm text-muted-foreground">{card.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>View My Homework</Button>
                </CardFooter>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-3">
                            {upcomingClasses.map(item => (
                                <div key={item.subject} className="flex items-center gap-3 text-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{item.time}</span>
                                    <span className="text-muted-foreground">{item.subject}</span>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Notices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                           {recentNotices.map(item => (
                                <div key={item.title} className="flex items-center gap-3 text-sm">
                                    <Megaphone className="h-4 w-4 text-primary" />
                                    <div className="flex-grow">
                                       <p className="font-medium truncate">{item.title}</p>
                                       <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
