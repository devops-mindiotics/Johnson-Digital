'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const assignedClasses = [
    { id: 'C10A', name: 'Class 10 - Section A', subject: 'Mathematics', students: 35 },
    { id: 'C9B', name: 'Class 9 - Section B', subject: 'History', students: 32 },
    { id: 'C10C', name: 'Class 10 - Section C', subject: 'Science', students: 38 },
];

const recentSubmissions = [
    { student: 'Olivia Smith', subject: 'Mathematics', assignment: 'Algebra II Worksheet', submittedOn: '2 hours ago'},
    { student: 'Noah Williams', subject: 'History', assignment: 'Roman Empire Essay', submittedOn: '5 hours ago'},
    { student: 'Emma Brown', subject: 'Science', assignment: 'Photosynthesis Lab Report', submittedOn: '1 day ago'},
    { student: 'Liam Johnson', subject: 'Mathematics', assignment: 'Algebra II Worksheet', submittedOn: '1 day ago'},
];

export default function MyClassesPage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Assigned Classes</CardTitle>
                    <CardDescription>An overview of the classes you are assigned to.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {assignedClasses.map(c => (
                             <Card key={c.id}>
                                <CardHeader>
                                    <CardTitle className="text-xl">{c.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm font-medium">{c.subject}</p>
                                    <p className="text-sm text-muted-foreground">{c.students} Students</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => router.push(`/dashboard/my-classes/${c.id}`)}>View Class</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Recent Homework Submissions</CardTitle>
                    <CardDescription>Latest assignments submitted by students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Subject</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentSubmissions.map(s => (
                                <TableRow key={s.student}>
                                    <TableCell>
                                        <div className="font-medium">{s.student}</div>
                                        <div className="text-xs text-muted-foreground">{s.assignment}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{s.subject}</div>
                                        <div className="text-xs text-muted-foreground">{s.submittedOn}</div>
                                    </TableCell>
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
