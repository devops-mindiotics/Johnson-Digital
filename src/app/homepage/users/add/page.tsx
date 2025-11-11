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
import { createStudent, createTeacher } from '@/lib/api/userApi';
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

const formSchema = z.object({
  school: z.string().optional(),
  type: z.enum(['Teacher', 'Student', 'School Admin']),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  gender: z.enum(['Male', 'Female']),
  mobileNumber: z.string().max(12, 'Mobile number cannot exceed 12 digits'),
  email: z.string().email(),
  status: z.enum(['Active', 'Inactive', 'Pending']).default('Pending'),
  schoolUniqueId: z.string().optional(),
  address: z.string(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pincode: z.string(),
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
  // School Admin fields
  expiryDate: z.string().optional(),
});

function AddUserPageForm() {
  const { user } = useAuth();
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Pending',
      type: (searchParams.get('type') as 'Teacher' | 'Student' | 'School Admin') || undefined,
      expiryDate: getExpiryDate(),
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
      if (userRole === SUPERADMIN || userRole === TENANTADMIN) {
        try {
          const schoolData = await getAllSchools();
          if (schoolData) {
            setSchools(schoolData);
          }
        } catch (error) {
          console.error("Failed to fetch schools:", error);
        }
      } else if (user?.schoolId) {
        setSelectedSchool(user.schoolId);
      }
    }
    fetchSchools();
  }, [userRole, user]);

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
    const schoolId = selectedSchool || user.schoolId;
    const schoolName = schools.find(s => s.id === schoolId)?.schoolName;

    if (values.type === 'Student') {
      try {
        const studentData = {
            userType: 'Student',
            ...values
        };
        await createStudent(user.tenantId, schoolId, values.classId, studentData);
        setFeedbackTitle('Success');
        setFeedbackMessage('Student created successfully.');
        setCreationSuccess(true);
        setShowFeedbackDialog(true);
      } catch (error: any) {
        console.error('Failed to create student:', error);
        const message = error.response?.data?.message || error.message || 'Failed to create student.';
        const statusCode = error.response?.status;
        setFeedbackTitle('Error');
        setFeedbackMessage(statusCode ? `${message} (${statusCode})` : message);
        setCreationSuccess(false);
        setShowFeedbackDialog(true);
      }
    } else if (values.type === 'Teacher') {
      try {
        const teacherData = {
            schoolName: schoolName,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dob: values.dob,
            phone: values.mobileNumber,
            email: values.email,
            employeeId: values.employeeId,
            joiningDate: values.joiningDate,
            experience: values.experience,
            address: values.address,
            city: values.city,
            district: values.district,
            state: values.state,
            pincode: values.pincode,
            status: 'active',
            expiryDate: values.expiryDate,
        };
        await createTeacher(schoolId, teacherData);
        setFeedbackTitle('Success');
        setFeedbackMessage('Teacher created successfully.');
        setCreationSuccess(true);
        setShowFeedbackDialog(true);
      } catch (error: any) {
        console.error('Failed to create teacher:', error);
        const message = error.response?.data?.message || error.message || 'Failed to create teacher.';
        const statusCode = error.response?.status;
        setFeedbackTitle('Error');
        setFeedbackMessage(statusCode ? `${message} (${statusCode})` : message);
        setCreationSuccess(false);
        setShowFeedbackDialog(true);
      }
    } else {
      console.log(values);
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Select School and User Type</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(userRole === SUPERADMIN || userRole === TENANTADMIN) && (
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School *</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedSchool(value)
                          setClasses([]);
                          setSections([]);
                          form.resetField('classId');
                          form.resetField('section');
                          setSelectedClass(null);
                        }} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a school" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schools.map((school) => (
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
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Teacher">Teacher</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="School Admin">School Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {type && (
            <>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold">General Information</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
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
                            <Input placeholder="e.g., john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold">Address Information</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  </div>
                </CardContent>
              </Card>

              {type === 'Teacher' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold">Teacher Details</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee ID *</FormLabel>
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
                            <FormLabel>Joining Date *</FormLabel>
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
                            <FormLabel>Experience *</FormLabel>
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
                            <FormLabel>Expiry Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              {type === 'Student' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold">Student Details</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Father Name/Guardian Name *</FormLabel>
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
                            <FormLabel>Mother Name *</FormLabel>
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
                            <FormLabel>Admission Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., S-54321" {...field} />
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
                            <FormLabel>Date of Birth *</FormLabel>
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
                            <FormLabel>Class *</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedClass(value)
                            }} value={field.value || ''}>
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
                            <FormLabel>Section *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value || ''} 
                              disabled={sections.length === 1 && sections[0].name === 'No Sections'}
                            >
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
                            <FormLabel>Permanent Education Number (PEN) *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {type === 'School Admin' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold">School Admin Details</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee ID *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., A-123" {...field} />
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
                            <FormLabel>Joining Date *</FormLabel>
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
                            <FormLabel>Experience *</FormLabel>
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
                            <FormLabel>Expiry Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button type="submit">Create User</Button>
            </>
          )}
        </form>
      </Form>

      <AlertDialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{feedbackTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {feedbackMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AddUserPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddUserPageForm />
        </Suspense>
    )
}
