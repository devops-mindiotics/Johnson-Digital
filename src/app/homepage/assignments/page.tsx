
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
import { useState, useEffect } from 'react';
import { CreateAssignmentDialog } from '@/components/create-assignment-dialog';
import { SubmitAssignmentDialog } from '@/components/submit-assignment-dialog';
import { ViewAssignmentDialog } from '@/components/view-assignment-dialog';
import { ReviewAssignmentDialog } from '@/components/review-assignment-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { DatePicker } from '@/components/ui/date-picker';
import { getHomeworks, createHomework, updateHomework, submitHomework } from '@/lib/api/homeworkApi';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const isTeacher = user?.roles.includes('TEACHER');
  const isSchoolAdmin = user?.roles.includes('SCHOOL_ADMIN');
  const canManageAssignments = isTeacher || isSchoolAdmin;
  const isMobile = useIsMobile();

  const [assignments, setAssignments] = useState([]);
  const [filters, setFilters] = useState<{ class: string; section: string; date: string | undefined }>({ class: '', section: '', date: undefined });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const params = {
            classId: filters.class === 'all' ? undefined : filters.class,
            sectionId: filters.section === 'all' ? undefined : filters.section,
            date: filters.date,
        };
        const homeworkData = await getHomeworks(user.tenantId, user.schoolId, params);
        setAssignments(homeworkData.data);
      } catch (error) {
        console.error("Failed to fetch homeworks:", error);
      }
    };

    fetchHomeworks();
  }, [user, filters]);

  const handleFilterChange = (filterType: string, value: string | undefined) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleCreateAssignment = async (data: any) => {
    try {
        const newAssignment = await createHomework(user.tenantId, user.schoolId, data);
        setAssignments([...assignments, newAssignment.data]);
    } catch (error) {
        console.error('Failed to create assignment:', error);
    }
  };

  const handleSubmitAssignment = async (assignmentId: number, submissionData: any) => {
    try {
        await submitHomework(user.tenantId, user.schoolId, user.classId, user.id, assignmentId, submissionData);
        setAssignments(
            assignments.map((assignment) =>
              assignment.id === assignmentId ? { ...assignment, status: 'Submitted' } : assignment
            )
          );
    } catch (error) {
        console.error('Failed to submit assignment:', error);
    }
  };

  const handleReviewAssignment = async (assignmentId: number, reviewData: any) => {
    try {
        const updatedAssignment = await updateHomework(user.tenantId, user.schoolId, assignmentId, reviewData);
        setAssignments(
            assignments.map((assignment) =>
              assignment.id === assignmentId ? updatedAssignment.data : assignment
            )
          );
    } catch (error) {
        console.error('Failed to review assignment:', error);
    }

  };

  const assigned = assignments.filter((assignment) => assignment.status === 'assigned');
  const submitted = assignments.filter((assignment) => assignment.status === 'submitted');
  const checked = assignments.filter((assignment) => assignment.status === 'reviewed' || assignment.status === 'completed');

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
                            <CardDescription>{item.subjectId}</CardDescription>
                            <div className="flex flex-grow justify-end items-center gap-2">
                                {user?.roles.includes('STUDENT') && item.status === 'assigned' && (
                                    <SubmitAssignmentDialog
                                    onSubmit={(submissionData) => handleSubmitAssignment(item.id, submissionData)}
                                    isIcon
                                    />
                                )}
                                {canManageAssignments && item.status === 'submitted' && (
                                    <ReviewAssignmentDialog
                                    assignment={item}
                                    onReassign={(reviewData) => handleReviewAssignment(item.id, { ...reviewData, status: 'assigned' })}
                                    onComplete={(reviewData) => handleReviewAssignment(item.id, { ...reviewData, status: 'completed' })}
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
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.subjectId}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  {user?.role !== 'Teacher' && <TableCell>{item.createdBy.name}</TableCell>}
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user?.roles.includes('STUDENT') && item.status === 'assigned' && (
                        <SubmitAssignmentDialog
                          onSubmit={(submissionData) => handleSubmitAssignment(item.id, submissionData)}
                        />
                      )}
                       {canManageAssignments && item.status === 'submitted' && (
                        <ReviewAssignmentDialog 
                          assignment={item} 
                          onReassign={(reviewData) => handleReviewAssignment(item.id, { ...reviewData, status: 'assigned' })}
                          onComplete={(reviewData) => handleReviewAssignment(item.id, { ...reviewData, status: 'completed' })}
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
                        {canManageAssignments
                        ? 'Manage assignments for your classes.'
                        : 'View and submit your assignments.'}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                {canManageAssignments && (
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
                {canManageAssignments &&
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
