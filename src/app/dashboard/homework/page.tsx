
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown, FileUp, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { CreateHomeworkDialog } from '@/components/create-homework-dialog';
import { SubmitHomeworkDialog } from '@/components/submit-homework-dialog';
import { ViewHomeworkDialog } from '@/components/view-homework-dialog';
import { ReviewHomeworkDialog } from '@/components/review-homework-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

const initialHomework = [
  {
    id: 1,
    subject: 'Mathematics',
    title: 'Algebra II Worksheet',
    teacher: 'Mrs. Davis',
    assignedDate: '2024-08-12',
    dueDate: '2024-08-19',
    status: 'Assigned',
    description: 'Complete the attached worksheet on algebraic equations.',
    class: '1',
    section: 'A',
  },
  {
    id: 2,
    subject: 'History',
    title: 'Essay on the Roman Empire',
    teacher: 'Mr. Black',
    assignedDate: '2024-08-10',
    dueDate: '2024-08-24',
    status: 'Submitted',
    description: 'Write a 1000-word essay on the fall of the Roman Empire.',
    class: '2',
    section: 'B',
  },
  {
    id: 3,
    subject: 'Science',
    title: 'Lab Report: Photosynthesis',
    teacher: 'Ms. White',
    assignedDate: '2024-08-05',
    dueDate: '2024-08-12',
    status: 'Checked',
    description: 'Submit your lab report on the photosynthesis experiment.',
    class: '1',
    section: 'A',
  },
  {
    id: 4,
    subject: 'English',
    title: 'Book Report: To Kill a Mockingbird',
    teacher: 'Ms. Blue',
    assignedDate: '2024-08-01',
    dueDate: '2024-08-15',
    status: 'Checked',
    description: 'Write a 500-word book report on To Kill a Mockingbird.',
    class: '3',
    section: 'C',
  },
];

export default function HomeworkPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher' || user?.role === 'School Admin';
  const isMobile = useIsMobile();

  const [homework, setHomework] = useState(initialHomework);
  const [filters, setFilters] = useState({ class: '', section: '', date: '' });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleCreateHomework = (data: any) => {
    const newHomework = {
      ...data,
      id: homework.length + 1,
      teacher: user?.name,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Assigned',
    };
    setHomework([...homework, newHomework]);
  };

  const handleSubmitHomework = (homeworkId: number) => {
    setHomework(
      homework.map((h) =>
        h.id === homeworkId ? { ...h, status: 'Submitted' } : h
      )
    );
  };

  const handleReviewHomework = (homeworkId: number, newStatus: 'Assigned' | 'Checked') => {
    setHomework(
      homework.map((h) =>
        h.id === homeworkId ? { ...h, status: newStatus } : h
      )
    );
  };

  const filteredHomework = homework.filter(h => {
    return (filters.class ? h.class === filters.class : true) &&
           (filters.section ? h.section === filters.section : true) &&
           (filters.date ? h.dueDate === filters.date : true);
  })

  const assigned = filteredHomework.filter((h) => h.status === 'Assigned');
  const submitted = filteredHomework.filter((h) => h.status === 'Submitted');
  const checked = filteredHomework.filter((h) => h.status === 'Checked');

  const renderTable = (data: typeof homework) => (
    <Table>
      {!isMobile && (
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Title</TableHead>
            {user?.role !== 'Teacher' && <TableHead>Teacher</TableHead>}
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data.map((item) => (
          isMobile ? (
            <Card key={item.id} className="mb-4">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Due Date:</span>
                  <span>{item.dueDate}</span>
                </div>
                <div className="flex justify-between mb-4">
                <span className="font-semibold">Status:</span>
                  <Badge variant={item.status === 'Checked' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2">
                  {user?.role === 'Student' && item.status === 'Assigned' && (
                    <SubmitHomeworkDialog
                      onSubmit={() => handleSubmitHomework(item.id)}
                      isIcon
                    />
                  )}
                  {isTeacher && item.status === 'Submitted' && (
                    <ReviewHomeworkDialog 
                      homework={item} 
                      onReassign={() => handleReviewHomework(item.id, 'Assigned')}
                      onComplete={() => handleReviewHomework(item.id, 'Checked')}
                    />
                  )}
                  <Button variant="outline" size="icon">
                    <FileDown className="mr-1 h-4 w-4" />
                  </Button>
                  <ViewHomeworkDialog homework={item} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.subject}</TableCell>
              <TableCell>{item.title}</TableCell>
              {user?.role !== 'Teacher' && <TableCell>{item.teacher}</TableCell>}
              <TableCell>{item.dueDate}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'Checked' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {user?.role === 'Student' && item.status === 'Assigned' && (
                    <SubmitHomeworkDialog
                      onSubmit={() => handleSubmitHomework(item.id)}
                    />
                  )}
                   {isTeacher && item.status === 'Submitted' && (
                    <ReviewHomeworkDialog 
                      homework={item} 
                      onReassign={() => handleReviewHomework(item.id, 'Assigned')}
                      onComplete={() => handleReviewHomework(item.id, 'Checked')}
                    />
                  )}
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-1 h-4 w-4" /> Download
                  </Button>
                  <ViewHomeworkDialog homework={item} />
                </div>
              </TableCell>
            </TableRow>
          )
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Homework</CardTitle>
            <CardDescription>
              {isTeacher
                ? 'Manage homework assignments for your classes.'
                : 'View and submit your homework assignments.'}
            </CardDescription>
          </div>
          {isTeacher &&
            (isMobile ? (
              <CreateHomeworkDialog onSubmit={handleCreateHomework} isIcon />
            ) : (
              <CreateHomeworkDialog onSubmit={handleCreateHomework} />
            ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select onValueChange={(value) => handleFilterChange('class', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1">1st</SelectItem>
                    <SelectItem value="2">2nd</SelectItem>
                    <SelectItem value="3">3rd</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('section', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Section" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                </SelectContent>
            </Select>
            <Input type="date" placeholder="Filter by Date" onChange={(e) => handleFilterChange('date', e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assigned">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assigned">Assigned ({assigned.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger>
            <TabsTrigger value="checked">Checked ({checked.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="assigned" className="mt-4">
            {renderTable(assigned)}
          </TabsContent>
          <TabsContent value="submitted" className="mt-4">
            {renderTable(submitted)}
          </TabsContent>
          <TabsContent value="checked" className="mt-4">
            {renderTable(checked)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
