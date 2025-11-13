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
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { updateUser, getStudentById } from '@/lib/api/userApi';
import { getClassesBySchool, getSectionsByClass } from '@/lib/api/classesApi';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';

// Schema for form validation
const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  gender: z.enum(['male', 'female', 'other']),
  mobileNumber: z.string().max(12, 'Mobile number cannot exceed 12 digits'),
  email: z.string().email(),
  status: z.enum(['active', 'inactive', 'pending', 'deleted']).default('active'),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  // Teacher fields
  employeeId: z.string().optional(),
  joiningDate: z.string().optional(),
  experience: z.string().optional(),
  // Student fields
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  admissionNumber: z.string().optional(),
  dob: z.string().optional(),
  pen: z.string().optional(),
  classId: z.string().optional(),
  section: z.string().optional(),
  academicYear: z.string().optional(),
  rollNumber: z.string().optional(),
  // School Admin fields
  expiryDate: z.string().optional(),
});

// Simple component to display non-editable info
function InfoDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold p-2 border rounded-md bg-muted/50 h-10 flex items-center">{value}</p>
    </div>
  );
}

export default function EditUserClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id: userId } = params;
  
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      const school = parsedUser.schools?.[0];
      const schoolId = school?.id || null;
      const schoolName = school?.schoolName || 'N/A';

      setUserData({ ...parsedUser, schoolName, type: parsedUser.type });
      setSelectedSchoolId(schoolId);

      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        try {
          return new Date(dateString).toISOString().split('T')[0];
        } catch (e) {
          return '';
        }
      };

      const defaultValues = {
        ...parsedUser,
        mobileNumber: parsedUser.phone,
        address: parsedUser.address?.line1,
        city: parsedUser.address?.city,
        district: parsedUser.address?.district,
        state: parsedUser.address?.state,
        pincode: parsedUser.address?.pincode,
        dob: formatDate(parsedUser.dob),
        joiningDate: formatDate(parsedUser.joiningDate),
        expiryDate: formatDate(parsedUser.expiryDate),
        experience: parsedUser.experience?.toString(),
      };
      
      form.reset(defaultValues);
      setLoading(false);

      if (parsedUser.type === 'Student' && user?.tenantId && schoolId && parsedUser.id) {
        async function fetchStudentDetails() {
          try {
            const studentDetails = await getStudentById(user.tenantId, schoolId, parsedUser.id);
            if (studentDetails) {
              const studentFormValues = {
                ...defaultValues,
                ...studentDetails,
                fatherName: studentDetails.guardian?.fatherName,
                motherName: studentDetails.guardian?.motherName,
                admissionNumber: studentDetails.admissionNo,
                rollNumber: studentDetails.classDetails?.rollNumber?.toString(),
                academicYear: studentDetails.classDetails?.academicYear,
                classId: studentDetails.classDetails?.classId,
                section: studentDetails.classDetails?.sectionId,
                dob: formatDate(studentDetails.dob),
              };
              form.reset(studentFormValues);
              setSelectedClass(studentDetails.classDetails?.classId);
            }
          } catch (error) {
            console.error('Failed to fetch student details:', error);
          }
        }
        fetchStudentDetails();
      }
    } else {
        setLoading(false);
    }
  }, [userId, user, form]);

  useEffect(() => {
    if (selectedSchoolId) {
      getClassesBySchool(selectedSchoolId).then(data => setClasses(data || [])).catch(() => setClasses([]));
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedClass) {
      getSectionsByClass(selectedSchoolId, selectedClass).then(data => setSections(data || [])).catch(() => setSections([]));
    }
  }, [selectedSchoolId, selectedClass]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedSchoolId || !user?.tenantId || !userData?.id || !userData?.type) {
      toast({ title: 'Error', description: 'Missing critical information to update user.', variant: 'destructive' });
      return;
    }

    try {
      await updateUser(user.tenantId, userData.id, { ...values, schoolId: selectedSchoolId, type: userData.type });
      setFeedbackTitle('Success');
      setFeedbackMessage('User updated successfully.');
      setUpdateSuccess(true);
      setShowFeedbackDialog(true);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      const message = error.response?.data?.message || 'Failed to update user.';
      setFeedbackTitle('Error');
      setFeedbackMessage(message);
      setShowFeedbackDialog(true);
    }
  }

  const handleDialogClose = () => {
    setShowFeedbackDialog(false);
    if (updateSuccess) {
      router.push('/homepage/users');
    }
  };
  
  if (loading) return <DashboardSkeleton />;
  if (!userData) return <p>User not found. Please go back to the users list and select a user to edit.</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit User: {userData.firstName} {userData.lastName}</CardTitle>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader><h3 className="text-lg font-bold">Role and School</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <InfoDisplay label="User Type" value={userData.type} />
                  <InfoDisplay label="School" value={userData.schoolName} />
                </div>
              </CardContent>
            </Card>

            {/* General Information */}
            <Card>
              <CardHeader><h3 className="text-lg font-bold">General Information</h3></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField 
                    control={form.control} 
                    name="firstName" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>First Name *</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., John" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="lastName" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Last Name *</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., Doe" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="mobileNumber" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Mobile Number *</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., 9876543210" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="email" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>E-Mail *</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., john.doe@example.com" {...field} readOnly disabled className="cursor-not-allowed bg-muted/50" /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader><h3 className="text-lg font-bold">Address Information</h3></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormField 
                  control={form.control} 
                  name="address" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <FormLabel>Address</FormLabel> 
                      <FormControl> 
                        <Input placeholder="e.g., 123 Main St" {...field} /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )}
                />
                <FormField 
                  control={form.control} 
                  name="city" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <FormLabel>City</FormLabel> 
                      <FormControl> 
                        <Input placeholder="e.g., Bangalore" {...field} /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )}
                />
                <FormField 
                  control={form.control} 
                  name="district" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <FormLabel>District</FormLabel> 
                      <FormControl> 
                        <Input placeholder="e.g., Bangalore Urban" {...field} /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )}
                />
                <FormField 
                  control={form.control} 
                  name="state" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <FormLabel>State</FormLabel> 
                      <FormControl> 
                        <Input placeholder="e.g., Karnataka" {...field} /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )}
                />
                <FormField 
                  control={form.control} 
                  name="pincode" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <FormLabel>Pincode</FormLabel> 
                      <FormControl> 
                        <Input placeholder="e.g., 560001" {...field} /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Dynamic Fields based on User Type */}
            {userData.type === 'Student' && (
              <Card>
                <CardHeader><h3 className="text-lg font-bold">Student Details</h3></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField 
                    control={form.control} 
                    name="fatherName" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Father Name/Guardian Name</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., Robert Doe" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="motherName" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Mother Name</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., Maria Doe" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="admissionNumber" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Admission Number</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., S-54321" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="rollNumber" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Roll Number</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., 23" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="dob" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Date of Birth</FormLabel> 
                        <FormControl> 
                          <Input type="date" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="classId" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Class</FormLabel> 
                        <Select onValueChange={(value) => { field.onChange(value); setSelectedClass(value); }} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="section" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Section</FormLabel> 
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sections.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="pen" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Permanent Education Number (PEN)</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., 1234567890" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="academicYear" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Academic Year</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., 2024-2025" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {(userData.type === 'Teacher' || userData.type === 'School Admin') && (
              <Card>
                <CardHeader><h3 className="text-lg font-bold">Professional Details</h3></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField 
                    control={form.control} 
                    name="employeeId" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Employee ID</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., T-123" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="joiningDate" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Joining Date</FormLabel> 
                        <FormControl> 
                          <Input type="date" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="experience" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Experience</FormLabel> 
                        <FormControl> 
                          <Input placeholder="e.g., 5 years" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="expiryDate" 
                    render={({ field }) => ( 
                      <FormItem> 
                        <FormLabel>Expiry Date</FormLabel> 
                        <FormControl> 
                          <Input type="date" {...field} /> 
                        </FormControl> 
                        <FormMessage /> 
                      </FormItem> 
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <Button type="submit">Update User</Button>
        </form>
      </Form>

      <AlertDialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{feedbackTitle}</AlertDialogTitle>
            <AlertDialogDescription>{feedbackMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
