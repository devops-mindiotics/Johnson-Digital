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
import { getTeacherById, updateTeacher } from '@/lib/api/userApi';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Teacher {
    id: string;
    userType: "Teacher";
    firstName: string;
    lastName: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    mobileNumber: string;
    email: string;
    employeeId: string;
    joiningDate: string;
    experience: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    status: "active" | "inactive";
    expiryDate: string;
    schoolId: string;
}

interface EditTeacherFormProps {
  teacherId: string;
  onTeacherUpdated: () => void;
}

export function EditTeacherForm({ teacherId, onTeacherUpdated }: EditTeacherFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Teacher | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (open) {
        const fetchTeacher = async () => {
            try {
                const teacher = await getTeacherById(teacherId);
                setFormData(teacher);
            } catch (error) {
                console.error("Failed to fetch teacher", error);
            }
        }
        fetchTeacher();
    }
  }, [open, teacherId]);

  useEffect(() => {
    if (formData) {
      const { id, schoolId, userType, ...requiredFields } = formData;
      const allFieldsFilled = Object.values(requiredFields).every(field => field !== '');
      setIsFormValid(allFieldsFilled);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !isFormValid) return;
    try {
      const { id, schoolId, userType, ...teacherData } = formData;
      await updateTeacher(teacherId, teacherData);
      onTeacherUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update teacher", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>
        {formData ? (
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                {Object.keys(formData).map((key) => {
                    if (key === 'id' || key === 'schoolId' || key === 'userType') return null;
                    return (
                        <div key={key} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={key} className="text-right">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        <Input id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} className="col-span-3" />
                        </div>
                    )
                    })}
                <Button type="submit" disabled={!isFormValid}>Save Changes</Button>
            </form>
        ) : <p>Loading...</p>}
      </DialogContent>
    </Dialog>
  );
}
