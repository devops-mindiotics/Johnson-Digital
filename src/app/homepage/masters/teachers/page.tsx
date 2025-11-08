'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
import { MoreHorizontal } from 'lucide-react';
import { getTeachersBySchool } from '@/lib/api/userApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddTeacherForm } from '@/components/add-teacher-form';
import { EditTeacherForm } from '@/components/edit-teacher-form';
import { DeleteTeacherDialog } from '@/components/delete-teacher-dialog';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await getTeachersBySchool();
      setTeachers(response);
    } catch (error) {
      console.error('Failed to fetch teachers', error);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Teachers</CardTitle>
        <AddTeacherForm onTeacherAdded={fetchTeachers} />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.employeeId}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <EditTeacherForm teacherId={teacher.id} onTeacherUpdated={fetchTeachers} />
                        <DeleteTeacherDialog teacherId={teacher.id} onTeacherDeleted={fetchTeachers} />
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
