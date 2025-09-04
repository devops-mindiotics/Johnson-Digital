
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
import { Eye, PlusCircle, FileDown, FileUp } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const homework = [
  {
    id: 1,
    subject: 'Mathematics',
    title: 'Algebra II Worksheet',
    teacher: 'Mrs. Davis',
    assignedDate: '2024-08-12',
    dueDate: '2024-08-19',
    status: 'Assigned',
  },
  {
    id: 2,
    subject: 'History',
    title: 'Essay on the Roman Empire',
    teacher: 'Mr. Black',
    assignedDate: '2024-08-10',
    dueDate: '2024-08-24',
    status: 'Submitted',
  },
  {
    id: 3,
    subject: 'Science',
    title: 'Lab Report: Photosynthesis',
    teacher: 'Ms. White',
    assignedDate: '2024-08-05',
    dueDate: '2024-08-12',
    status: 'Checked',
    marks: 'A+',
  },
  {
    id: 4,
    subject: 'English',
    title: 'Book Report: To Kill a Mockingbird',
    teacher: 'Ms. Blue',
    assignedDate: '2024-08-01',
    dueDate: '2024-08-15',
    status: 'Checked',
    marks: 'B',
  },
];

export default function HomeworkPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher' || user?.role === 'School Admin';

  const assigned = homework.filter((h) => h.status === 'Assigned');
  const submitted = homework.filter((h) => h.status === 'Submitted');
  const checked = homework.filter((h) => h.status === 'Checked');

  const renderTable = (data: typeof homework) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Title</TableHead>
          {user?.role !== 'Teacher' && <TableHead>Teacher</TableHead>}
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          {user?.role !== 'Teacher' && <TableHead>Marks</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
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
            {user?.role !== 'Teacher' && <TableCell>{item.marks || 'N/A'}</TableCell>}
            <TableCell>
                <div className="flex gap-2">
                    {user?.role === 'Student' && item.status === 'Assigned' && <Button size="sm"><FileUp className="mr-1 h-4 w-4" /> Submit</Button>}
                    <Button variant="outline" size="sm"><FileDown className="mr-1 h-4 w-4" /> Download</Button>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                </div>
            </TableCell>
          </TableRow>
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
                {isTeacher ? 'Manage homework assignments for your classes.' : 'View and submit your homework assignments.'}
            </CardDescription>
          </div>
          {isTeacher && (
            <Button>
              <PlusCircle className="mr-2" /> Create Homework
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assigned">
          <TabsList>
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
