
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, BookUser } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

const diaryEntries = {
    '2024-08-20': [
        { id: 1, type: 'Homework', subject: 'Mathematics', details: 'Complete the worksheet on Algebra II.'},
        { id: 2, type: 'Note', subject: 'General', details: 'Parent-Teacher meeting on Saturday.'},
    ],
    '2024-08-22': [
        { id: 3, type: 'Event', subject: 'School', details: 'Annual Sports Day practice after school.'},
    ]
};

const teacherClasses = ['Class 10A', 'Class 9B', 'Class 8C'];
const teacherSubjects = ['Mathematics', 'History', 'Science'];

type DiaryEntry = {
    id: number;
    type: string;
    subject: string;
    details: string;
};

export default function DiaryPage() {
  const [date, setDate] = useState<Date | undefined>(new Date('2024-08-20'));
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher' || user?.role === 'School Admin';

  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const entriesForDate: DiaryEntry[] = (diaryEntries as Record<string, DiaryEntry[]>)[selectedDateStr] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                    />
                </CardContent>
            </Card>
            {isTeacher && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Select Context</CardTitle>
                        <CardDescription>Choose class and subject to add or view entries.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Class</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teacherClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <label className="text-sm font-medium">Subject</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teacherSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>
                                Diary for {date ? format(date, 'PPP') : 'N/A'}
                            </CardTitle>
                            <CardDescription>
                                Notes, events, and homework for the selected day.
                            </CardDescription>
                        </div>
                        {isTeacher && (
                            <Button>
                                <PlusCircle className="mr-2" /> Add Entry
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                        {entriesForDate.length > 0 ? (
                            entriesForDate.map((entry) => (
                                <div key={entry.id} className="flex items-start gap-4 p-4 rounded-lg border bg-background">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                       <BookUser className="h-6 w-6" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{entry.type}: <span className="font-normal">{entry.subject}</span></p>
                                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No entries for this date.</p>
                            </div>
                        )}
                   </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
