'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateStudent } from '@/lib/api/userApi';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  dob: string; 
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  email: string;
  admissionNumber: string;
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

interface EditStudentFormProps {
  classId: string;
  student: Student;
  onStudentUpdated: () => void;
}

export function EditStudentForm({ classId, student, onStudentUpdated }: EditStudentFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(student);

  useEffect(() => {
    setFormData(student);
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStudent(classId, student.id, formData);
      onStudentUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update student", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {Object.keys(formData).map((key) => {
            if (key === 'id') return null;
            return (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={key} className="text-right">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} className="col-span-3" />
                </div>
            )
            })}
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
