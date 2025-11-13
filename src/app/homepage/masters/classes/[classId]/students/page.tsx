'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
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
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { getStudentsByClass } from '@/lib/api/userApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddStudentForm } from '@/components/add-student-form';
import { EditStudentForm } from '@/components/edit-student-form';
import { DeleteStudentDialog } from '@/components/delete-student-dialog';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  admissionNumber: string;
  gender: "Male" | "Female" | "Other";
  dob: string; 
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  pen: string;
  joiningDate: string; 
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  status: "active" | "inactive";
  expiryDate: string;
  schoolUniqueId: string;
}

export default function ClassStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = useCallback(async () => {
    if (classId) {
      try {
        const response = await getStudentsByClass(classId);
        setStudents(response);
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    }
  }, [classId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Students</CardTitle>
        </div>
        <AddStudentForm classId={classId} onStudentAdded={fetchStudents} />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.admissionNumber}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <EditStudentForm classId={classId} student={student} onStudentUpdated={fetchStudents} />
                        <DeleteStudentDialog classId={classId} studentId={student.id} onStudentDeleted={fetchStudents} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
