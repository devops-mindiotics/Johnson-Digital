
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
import { FileDown, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { CreateAssignmentDialog } from '@/components/create-assignment-dialog';
import { SubmitAssignmentDialog } from '@/components/submit-assignment-dialog';
import { ViewAssignmentDialog } from '@/components/view-assignment-dialog';
import { ReviewAssignmentDialog } from '@/components/review-assignment-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { DatePicker } from '@/components/ui/date-picker';

const initialAssignments = [
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

export default function AssignmentsPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher' || user?.role === 'School Admin';
  const isMobile = useIsMobile();

  const [assignments, setAssignments] = useState(initialAssignments);
  const [filters, setFilters] = useState<{ class: string; section: string; date: string | undefined }>({ class: '', section: '', date: undefined });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterType: string, value: string | undefined) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleCreateAssignment = (data: any) => {
    const newAssignment = {
      ...data,
      id: assignments.length + 1,
      teacher: user?.name,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Assigned',
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleSubmitAssignment = (assignmentId: number) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === assignmentId ? { ...assignment, status: 'Submitted' } : assignment
      )
    );
  };

  const handleReviewAssignment = (assignmentId: number, newStatus: 'Assigned' | 'Checked') => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === assignmentId ? { ...assignment, status: newStatus } : assignment
      )
    );
  };

  const filteredAssignments = assignments.filter(assignment => {
    return (filters.class ? assignment.class === filters.class : true) &&
           (filters.section ? assignment.section === filters.section : true) &&
           (filters.date ? assignment.dueDate === filters.date : true);
  })

  const assigned = filteredAssignments.filter((assignment) => assignment.status === 'Assigned');
  const submitted = filteredAssignments.filter((assignment) => assignment.status === 'Submitted');
  const checked = filteredAssignments.filter((assignment) => assignment.status === 'Checked');

  const renderTable = (data: typeof assignments) => (
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
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <div className="flex items-center pt-2">
                            <CardDescription>{item.subject}</CardDescription>
                            <div className="flex flex-grow justify-end items-center gap-2">
                                {user?.role === 'Student' && item.status === 'Assigned' && (
                                    <SubmitAssignmentDialog
                                    onSubmit={() => handleSubmitAssignment(item.id)}
                                    isIcon
                                    />
                                )}
                                {isTeacher && item.status === 'Submitted' && (
                                    <ReviewAssignmentDialog
                                    assignment={item}
                                    onReassign={() => handleReviewAssignment(item.id, 'Assigned')}
                                    onComplete={() => handleReviewAssignment(item.id, 'Checked')}
                                    />
                                )}
                                <Button variant="outline" size="icon">
                                    <FileDown className="h-4 w-4" />
                                </Button>
                                <ViewAssignmentDialog assignment={item} />
                            </div>
                        </div>
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
                        <SubmitAssignmentDialog
                          onSubmit={() => handleSubmitAssignment(item.id)}
                        />
                      )}
                       {isTeacher && item.status === 'Submitted' && (
                        <ReviewAssignmentDialog 
                          assignment={item} 
                          onReassign={() => handleReviewAssignment(item.id, 'Assigned')}
                          onComplete={() => handleReviewAssignment(item.id, 'Checked')}
                        />
                      )}
                      <Button variant="outline" size="sm">
                        <FileDown className="mr-1 h-4 w-4" /> Download
                      </Button>
                      <ViewAssignmentDialog assignment={item} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
  );

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>
                        {isTeacher
                        ? 'Manage assignments for your classes.'
                        : 'View and submit your assignments.'}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                {isTeacher && (
                    isMobile ? (
                        <Button size="icon" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    )
                )}
                {isTeacher &&
                    (isMobile ? (
                        <CreateAssignmentDialog onSubmit={handleCreateAssignment} isIcon />
                    ) : (
                        <CreateAssignmentDialog onSubmit={handleCreateAssignment} />
                    ))}
                </div>
            </CardHeader>
            {showFilters && (
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <DatePicker 
                        value={filters.date} 
                        onChange={(value) => handleFilterChange('date', value)}
                        placeholder="Select a date"
                    />
                </div>
            </CardContent>
            )}
        </Card>

        <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assigned">Assigned ({assigned.length})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger>
                <TabsTrigger value="checked">Checked ({checked.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned">
                <Card>
                    <CardContent className="pt-6">
                        {renderTable(assigned)}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="submitted">
                <Card>
                    <CardContent className="pt-6">
                        {renderTable(submitted)}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="checked">
                <Card>
                    <CardContent className="pt-6">
                        {renderTable(checked)}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
