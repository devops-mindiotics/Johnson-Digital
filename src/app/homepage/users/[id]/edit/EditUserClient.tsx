'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { updateStudent, updateTeacher } from '@/lib/api/userApi';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  userId: z.string(),
  type: z.enum(['Teacher', 'Student', 'School Admin']),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  gender: z.enum(['Male', 'Female']),
  mobileNumber: z.string().max(20, 'Mobile number too long'),
  email: z.string().email(),
  school: z.string().min(1, 'School is required'),
  status: z.enum(['Active', 'Inactive', 'Pending']).default('Pending'),
  schoolUniqueId: z.string().min(1, 'School Unique ID is required'),
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  district: z.string().optional().default(''),
  state: z.string().optional().default(''),
  pincode: z.string().optional().default(''),
  employeeId: z.string().optional(),
  joiningDate: z.string().optional(),
  experience: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  admissionNumber: z.string().optional(),
  dob: z.string().optional(),
  pen: z.string().optional(),
  expiryDate: z.string().optional(),
  classId: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export default function EditUserClient({
  initialUser,
  schools,
}: {
  initialUser: FormValues;
  schools: { schoolId: string; schoolName: string }[];
}) {
  const router = useRouter();
  const { user } = useAuth();
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: initialUser });
  const type = form.watch('type');
  const schoolOptions = useMemo(() => schools.map(s => `${s.schoolId}-${s.schoolName}`), [schools]);

  async function onSubmit(values: FormValues) {
    const [schoolId] = values.school?.split('-') || [];
    if (values.type === 'Student') {
      try {
        await updateStudent(user.tenantId, schoolId, values.classId, values.userId, values);
        // Add success notification here
        router.push('/homepage/users');
      } catch (error) {
        console.error('Failed to update student:', error);
        // Add error notification here
      }
    } else if (values.type === 'Teacher') {
      try {
        await updateTeacher(user.tenantId, schoolId, values.userId, values);
        // Add success notification here
        router.push('/homepage/users');
      } catch (error) {
        console.error('Failed to update teacher:', error);
        // Add error notification here
      }
    } else {
      console.log(values);
      router.push('/homepage/users');
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* General */}
          <Card>
            <CardHeader><h3 className="text-lg font-bold">General Information</h3></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>First Name *</FormLabel><FormControl><Input placeholder="e.g., John" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input placeholder="e.g., Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                  <FormItem><FormLabel>Mobile Number *</FormLabel><FormControl><Input placeholder="e.g., 9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>E-Mail *</FormLabel><FormControl><Input placeholder="e.g., john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="School Admin">School Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
            </CardContent>
          </Card>

          {/* School */}
          <Card>
            <CardHeader><h3 className="text-lg font-bold">School Information</h3></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormField control={form.control} name="school" render={({ field }) => (
                  <FormItem>
                    <FormLabel>School *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {schoolOptions.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="schoolUniqueId" render={({ field }) => (
                  <FormItem><FormLabel>School Unique ID *</FormLabel><FormControl><Input placeholder="e.g., GH-1234" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader><h3 className="text-lg font-bold">Address Information</h3></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="e.g., 123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Bangalore" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="district" render={({ field }) => (
                  <FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="e.g., Bangalore Urban" {...field} /></FormControl><FormMessage /></FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g., Karnataka" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="pincode" render={({ field }) => (
                  <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="e.g., 560001" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </CardContent>
          </Card>

          {/* Conditional sections */}
          {type === 'Teacher' && (
            <Card>
              <CardHeader><h3 className="text-lg font-bold">Teacher Details</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField control={form.control} name="employeeId" render={({ field }) => (
                    <FormItem><FormLabel>Employee ID *</FormLabel><FormControl><Input placeholder="e.g., T-123" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="joiningDate" render={({ field }) => (
                    <FormItem><FormLabel>Joining Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="experience" render={({ field }) => (
                    <FormItem><FormLabel>Experience *</FormLabel><FormControl><Input placeholder="e.g., 5 years" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </CardContent>
            </Card>
          )}

          {type === 'Student' && (
            <Card>
              <CardHeader><h3 className="text-lg font-bold">Student Details</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField control={form.control} name="fatherName" render={({ field }) => (
                    <FormItem><FormLabel>Father Name/Guardian Name *</FormLabel><FormControl><Input placeholder="e.g., Robert Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="motherName" render={({ field }) => (
                    <FormItem><FormLabel>Mother Name *</FormLabel><FormControl><Input placeholder="e.g., Maria Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="admissionNumber" render={({ field }) => (
                    <FormItem><FormLabel>Admission Number *</FormLabel><FormControl><Input placeholder="e.g., S-54321" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem><FormLabel>Date of Birth *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="pen" render={({ field }) => (
                    <FormItem><FormLabel>Permanent Education Number (PEN) *</FormLabel><FormControl><Input placeholder="e.g., 1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </CardContent>
            </Card>
          )}

          {type === 'School Admin' && (
            <Card>
              <CardHeader><h3 className="text-lg font-bold">School Admin Details</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField control={form.control} name="employeeId" render={({ field }) => (
                    <FormItem><FormLabel>Employee ID *</FormLabel><FormControl><Input placeholder="e.g., A-123" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="joiningDate" render={({ field }) => (
                    <FormItem><FormLabel>Joining Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="expiryDate" render={({ field }) => (
                    <FormItem><FormLabel>Expiry Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="submit">Update User</Button>
            <Button type="button" variant="outline" onClick={() => router.push('/homepage/users')}>Cancel</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
