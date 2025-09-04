
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Users, GraduationCap, UserCheck, BookUser, Activity, MessageSquare, PlusCircle } from 'lucide-react';
import type { User } from '@/contexts/auth-context';

const stats = [
  { title: 'Total Teachers', value: '150', icon: Users },
  { title: 'Total Students', value: '1,200', icon: GraduationCap },
  { title: 'Classes', value: '45', icon: BookUser },
  { title: 'New Admissions', value: '52', icon: UserCheck },
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

export default function SchoolAdminDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h2>
            <div className="flex gap-2">
                <Button><PlusCircle className="mr-2"/> Add Student</Button>
                <Button variant="outline"><PlusCircle className="mr-2"/> Add Teacher</Button>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => (
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

         <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>An overview of recent activities in the school.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivities.map(activity => (
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
        </Card>
    </div>
  );
}
