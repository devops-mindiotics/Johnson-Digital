
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
import { BookUser, Users, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="lg:col-span-2 relative overflow-hidden">
                <CardHeader className="relative z-10">
                    <CardTitle className="text-primary-foreground text-2xl">Master Your Day</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Your central hub for classes, assignments, and student progress.</CardDescription>
                </CardHeader>
                <CardFooter className="relative z-10">
                    <Button variant="secondary">View My Classes</Button>
                </CardFooter>
                 <Image src="https://picsum.photos/800/400?q=10" alt="Teacher background" fill className="object-cover" data-ai-hint="teacher classroom" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
            </Card>
             {summaryStats.map(stat => (
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
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {todaySchedule.map((item, index) => (
                            <div key={`${item.class}-${index}`} className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-1" />
                                <div>
                                    <p className="text-sm font-medium">{item.class}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>Pending Homework Submissions</CardTitle>
                        <CardDescription>Review the latest assignments from your students.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Assignment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingSubmissions.map(s => (
                                <TableRow key={s.student}>
                                    <TableCell className="font-medium">{s.student}</TableCell>
                                    <TableCell>{s.subject}</TableCell>
                                    <TableCell>{s.assignment}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
