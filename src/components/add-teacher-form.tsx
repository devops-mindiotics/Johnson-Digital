'use client';
import React, { useState } from 'react';
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
import { createTeacher } from '@/lib/api/userApi';
import { PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddTeacherFormProps {
  onTeacherAdded: () => void;
}

export function AddTeacherForm({ onTeacherAdded }: AddTeacherFormProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male' as "Male" | "Female" | "Other",
    dob: '',
    mobileNumber: '',
    email: '',
    employeeId: '',
    joiningDate: '',
    experience: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    status: 'active' as "active" | "inactive",
    expiryDate: '',
    schoolId: '' // This will be fetched from context
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeacher(formData);
      onTeacherAdded();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create teacher", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={isMobile ? 'icon' : 'default'}>
            <PlusCircle className={isMobile ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
            {!isMobile && 'Add Teacher'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {Object.keys(formData).map((key) => {
            if (key === 'schoolId') return null;
            return (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={key} className="text-right">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} className="col-span-3" />
                </div>
            )
            })}
          <Button type="submit">Create Teacher</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
