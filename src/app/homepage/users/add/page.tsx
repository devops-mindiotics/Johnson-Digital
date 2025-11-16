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
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getAllSchools } from '@/lib/api/schoolApi';
import { getClassesBySchool, getSectionsByClass } from '@/lib/api/classesApi';
import { SUPERADMIN, TENANTADMIN } from '@/lib/utils/constants';
import { getRoles } from '@/lib/utils/getRole';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StudentFields } from '@/components/add-user/student-fields';
import { TeacherFields } from '@/components/add-user/teacher-fields';
import { SchoolAdminFields } from '@/components/add-user/school-admin-fields';
import { CommonFields } from '@/components/add-user/common-fields';
import { createUser } from '@/lib/api/userCreation';

const formSchema = z.object({
  school: z.string().optional(),
  type: z.enum(['Teacher', 'Student', 'School Admin']),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  gender: z.enum(['male', 'female']),
  mobileNumber: z.string().max(12, 'Mobile number cannot exceed 12 digits'),
  email: z.string().email(),
  status: z.enum(['active', 'inactive', 'pending', 'deleted']).default('active'),
  schoolUniqueId: z.string().optional(),
  address: z.string(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pincode: z.string(),
  expiryDate: z.string().min(1, 'Expiry Date is required'),
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
}).refine(data => {
    if (data.type === 'School Admin') {
        return !!data.employeeId && !!data.joiningDate && !!data.experience;
    }
    return true;
}, {
    message: 'Employee ID, Joining Date, and Experience are required for School Admins',
    path: ['employeeId', 'joiningDate', 'experience'],
});

function AddUserPageForm() {
  const { user, schoolId: userSchoolId, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userRole = getRoles();
  const [schools, setSchools] = useState<{ id: string; schoolName: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [creationSuccess, setCreationSuccess] = useState(false);

  const getExpiryDate = () => {
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    return `${nextYear}-04-30`;
  };

  const getCurrentAcademicYear = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (currentMonth >= 3) { // April or later
        return `${currentYear}-${currentYear + 1}`;
    } else { // Before April
        return `${currentYear - 1}-${currentYear}`;
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'active',
      type: (searchParams.get('type') as 'Teacher' | 'Student' | 'School Admin') || undefined,
      expiryDate: getExpiryDate(),
      academicYear: getCurrentAcademicYear(),
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      address: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    async function fetchSchools() {
      if (isLoading || !user?.tenantRoles?.[0]?.tenantId) {
        console.log("Waiting for user and tenantId to be loaded...");
        return;
      }
      const tenantId = user.tenantRoles[0].tenantId;
      console.log("Fetching schools for tenantId:", tenantId);
      try {
        const schoolData = await getAllSchools(tenantId);
        console.log("Fetched school data:", schoolData);
        if (schoolData) {
          setSchools(schoolData);
          if (userRole !== SUPERADMIN && userRole !== TENANTADMIN && userSchoolId) {
            console.log("Setting school for non-admin user:", userSchoolId);
            setSelectedSchool(userSchoolId);
            form.setValue('school', userSchoolId, { shouldValidate: true });
          }
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
        toast({
          title: 'Error',
          description: 'Could not fetch schools. Please try again later.',
          variant: 'destructive',
        });
      }
    }
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user, userRole, userSchoolId, toast, form]);

  useEffect(() => {
    async function fetchClasses() {
        if (selectedSchool) {
            try {
                const classData = await getClassesBySchool(selectedSchool);
                setClasses(classData || []);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                setClasses([]);
            }
        } else {
            setClasses([]);
        }
    }
    fetchClasses();
  }, [selectedSchool]);

  useEffect(() => {
    async function fetchSections() {
      if (selectedSchool && selectedClass) {
        try {
          form.resetField('section');
          const sectionData = await getSectionsByClass(selectedSchool, selectedClass);

          if (!sectionData || sectionData.length === 0) {
            setSections([]);
            return;
          }

          if (sectionData.length === 1 && sectionData[0].name === 'No Sections') {
            setSections(sectionData);
            form.setValue('section', sectionData[0].id, { shouldValidate: true });
          } else {
            const filteredSections = sectionData.filter(section => section.name !== 'No Sections');
            setSections(filteredSections);
          }
        } catch (error) {
          console.error("Failed to fetch sections:", error);
          setSections([]);
        }
      } else {
        setSections([]);
      }
    }
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchool, selectedClass]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const schoolId = selectedSchool || userSchoolId;
    const schoolName = schools.find(s => s.id === schoolId)?.schoolName || '';
    const tenantId = user?.tenantRoles?.[0]?.tenantId;

    if (!tenantId) {
        console.error("Could not determine tenant. Aborting user creation.");
        setFeedbackTitle('Error');
        setFeedbackMessage('Could not determine tenant. Please try logging in again.');
        setShowFeedbackDialog(true);
        return;
    }

    console.log("Creating user for tenantId:", tenantId);

    let token;
    try {
        token = localStorage.getItem('sessionJWT');
        if (!token) {
            throw new Error('Session token not found. Please log in again.');
        }
    } catch (error: any) {
        console.error("Failed to get authentication token:", error);
        setFeedbackTitle('Error');
        setFeedbackMessage(error.message || 'Could not retrieve authentication token. Please try logging in again.');
        setShowFeedbackDialog(true);
        return;
    }

    try {
        await createUser(values, token, tenantId, schoolId, schoolName, classes, sections);
        setFeedbackTitle('Success');
        setFeedbackMessage(`${values.type} created successfully.`);
        setCreationSuccess(true);
    } catch (error: any) {
        setFeedbackTitle('Error');
        setFeedbackMessage(error.message);
        setCreationSuccess(false);
    } finally {
        setShowFeedbackDialog(true);
    }
  }

  const type = form.watch('type');

  const handleDialogClose = () => {
    setShowFeedbackDialog(false);
    if (creationSuccess) {
      router.push('/homepage/users');
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Add New User</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Role and School</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(userRole === SUPERADMIN || userRole === TENANTADMIN) && (
                    <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select
                            onValueChange={value => {
                            field.onChange(value);
                            setSelectedSchool(value);
                            }}
                            value={field.value || ''}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a school" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {schools.map(school => (
                                <SelectItem key={school.id} value={school.id}>
                                {school.schoolName}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>User Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a user type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                            <SelectItem value="School Admin">School Admin</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </CardContent>
            </Card>

            <div className={`grid grid-cols-1 ${type ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8 items-start`}>
                <Card>
                    <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CommonFields form={form} />
                    </CardContent>
                </Card>

                {type && (
                    <Card>
                        <CardHeader>
                        <CardTitle>{type} Specific Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {type === 'Student' && (
                            <StudentFields
                                form={form}
                                classes={classes}
                                sections={sections}
                                selectedClass={selectedClass}
                                setSelectedClass={setSelectedClass}
                            />
                            )}
                            {type === 'Teacher' && <TeacherFields form={form} />}
                            {type === 'School Admin' && <SchoolAdminFields form={form} />}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex justify-end pt-8">
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
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
    </Suspense>
  );
}

export default function AddUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddUserPageForm />
    </Suspense>
  );
}
