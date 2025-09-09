'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { School, User, GraduationCap, Users, ClipboardList } from 'lucide-react';
import type { User as UserType } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const chartData = [
  { month: 'Jan', schools: 4 },
  { month: 'Feb', schools: 3 },
  { month: 'Mar', schools: 5 },
  { month: 'Apr', schools: 7 },
  { month: 'May', schools: 2 },
  { month: 'Jun', schools: 10 },
  { month: 'Jul', schools: 6 },
];

const stats = [
    { title: 'Total Schools', value: '1,250', icon: School, change: '+11.5%' },
    { title: 'School Admins', value: '2,500', icon: User, change: '+8.2%' },
    { title: 'Total Teachers', value: '15,300', icon: GraduationCap, change: '+15.1%' },
    { title: 'Total Students', value: '250,000', icon: Users, change: '+21.3%' },
];

export default function SuperAdminDashboard({ user }: { user: UserType }) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
            <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                </CardContent>
            </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => router.push('/dashboard/schools')} className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
                <div className="inline-flex items-center justify-center rounded-full bg-blue-50 p-3">
                    <School className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-sm text-blue-700">Add School</div>
            </button>

            <button onClick={() => router.push('/dashboard/content')} className="flex-1 flex flex-col items-center gap-2 bg-white rounded-md p-4 hover:bg-gray-50 transition border">
                <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-3">
                    <ClipboardList className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm text-green-700">Add Content</div>
            </button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Schools Onboarding</CardTitle>
          <CardDescription>New schools onboarded over the last 7 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="schools" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
