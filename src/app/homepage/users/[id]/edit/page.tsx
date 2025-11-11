'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getAllSchools } from '@/lib/api/schoolApi';
import { updateUser } from '@/lib/api/userApi';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';

const formSchema = z.object({
  type: z.enum(['Teacher', 'Student', 'School Admin', 'User']),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  gender: z.enum(['Male', 'Female']),
  phone: z.string().max(15, 'Mobile number cannot exceed 15 digits').optional().nullable(),
  email: z.string().email(),
  schoolId: z.string().min(1, 'School is required'),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  schoolUniqueId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  joiningDate: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  motherName: z.string().optional().nullable(),
  admissionNumber: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  permanentEducationNumber: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
});

export default function EditUserPage() {
  const router = useRouter();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [schools, setSchools] = useState<{ id: string; schoolName: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const storedUser = localStorage.getItem('selectedUser');
        if (!storedUser) {
          return; 
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (loggedInUser && (loggedInUser.role === 'SUPERADMIN' || loggedInUser.role === 'TENANTADMIN')) {
          const schoolData = await getAllSchools();
          setSchools(schoolData);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [loggedInUser]);

  useEffect(() => {
    if (user) {
      const userType = user.roles?.includes('TEACHER') ? 'Teacher' 
                     : user.roles?.includes('STUDENT') ? 'Student' 
                     : user.roles?.includes('SCHOOL_ADMIN') ? 'School Admin' 
                     : 'User';

      const initialValues = {
        ...user,
        type: userType,
        schoolId: user.schools?.[0]?.id,
        schoolUniqueId: user.schools?.[0]?.schoolCode,
        address: user.address?.line1,
        city: user.address?.city,
        district: user.address?.district,
        state: user.address?.state,
        pincode: user.address?.pincode,
      };
      form.reset(initialValues);
    }
  }, [user, form.reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!loggedInUser || !user) return;
    try {
      await updateUser(loggedInUser.tenantId, user.id, values);
      router.push('/homepage/users');
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }

  const type = form.watch('type');

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not load user data. Please return to the list and try again.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/homepage/users')}>Back to Users</Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Edit User</CardTitle></CardHeader>
        </Card>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader><h3 className="text-lg font-bold">General Information</h3></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name *</FormLabel><FormControl><Input placeholder="e.g., John" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input placeholder="e.g., Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="e.g., 9876543210" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>E-Mail *</FormLabel><FormControl><Input placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Teacher">Teacher</SelectItem><SelectItem value="Student">Student</SelectItem><SelectItem value="School Admin">School Admin</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><h3 className="text-lg font-bold">School Information</h3></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FormField control={form.control} name="schoolId" render={({ field }) => (<FormItem><FormLabel>School *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger></FormControl><SelectContent>{schools.map((school) => (<SelectItem key={school.id} value={school.id}>{school.schoolName}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="schoolUniqueId" render={({ field }) => (<FormItem><FormLabel>School Unique ID</FormLabel><FormControl><Input placeholder="e.g., GH-1234" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><h3 className="text-lg font-bold">Address Information</h3></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="e.g., 123 Main St" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Bangalore" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="district" render={({ field }) => (<FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="e.g., Bangalore Urban" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g., Karnataka" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="e.g., 560001" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </CardContent>
                </Card>

                {type === 'Teacher' && (
                    <Card>
                        <CardHeader><h3 className="text-lg font-bold">Teacher Details</h3></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <FormField control={form.control} name="employeeId" render={({ field }) => (<FormItem><FormLabel>Employee ID</FormLabel><FormControl><Input placeholder="e.g., T-123" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="joiningDate" render={({ field }) => (<FormItem><FormLabel>Joining Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Experience</FormLabel><FormControl><Input placeholder="e.g., 5 years" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {type === 'Student' && (
                    <Card>
                        <CardHeader><h3 className="text-lg font-bold">Student Details</h3></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem><FormLabel>Father Name/Guardian Name</FormLabel><FormControl><Input placeholder="e.g., Robert Doe" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem><FormLabel>Mother Name</FormLabel><FormControl><Input placeholder="e.g., Maria Doe" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="admissionNumber" render={({ field }) => (<FormItem><FormLabel>Admission Number</FormLabel><FormControl><Input placeholder="e.g., S-54321" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="permanentEducationNumber" render={({ field }) => (<FormItem><FormLabel>Permanent Education Number (PEN)</FormLabel><FormControl><Input placeholder="e.g., 1234567890" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {type === 'School Admin' && (
                    <Card>
                        <CardHeader><h3 className="text-lg font-bold">School Admin Details</h3></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <FormField control={form.control} name="employeeId" render={({ field }) => (<FormItem><FormLabel>Employee ID</FormLabel><FormControl><Input placeholder="e.g., A-123" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="joiningDate" render={({ field }) => (<FormItem><FormLabel>Joining Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="expiryDate" render={({ field }) => (<FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>
                )}
                <div className="flex gap-4">
                    <Button type="submit">Update User</Button>
                    <Button variant="outline" type="button" onClick={() => router.push('/homepage/users')}>Cancel</Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
