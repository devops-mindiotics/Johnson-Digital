// app/dashboard/users/[id]/edit/page.tsx
import { notFound } from 'next/navigation';

// IDs to export
const ALL_USER_IDS = ['usr_5e88488a7558f62f3e36f4d7', 'usr_5e88488a7558f62f3e36f4d8', 'usr_5e88488a7558f62f3e36f4d9'];

const USERS: Record<string, any> = {
  usr_5e88488a7558f62f3e36f4d7: {
    id: 'usr_5e88488a7558f62f3e36f4d7',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'Male',
    mobileNumber: '+91-9876543210',
    email: 'aarav@example.com',
    type: 'Teacher',
    school: 'GH-123-Greenwood High',
    status: 'Active',
    schoolUniqueId: 'JSN-123',
    address: '456 Park Avenue',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pincode: '400001',
    employeeId: 'T-123',
    joiningDate: '2021-07-20',
    experience: '5 years',
  },
  usr_5e88488a7558f62f3e36f4d8: {
    id: 'usr_5e88488a7558f62f3e36f4d8',
    firstName: 'Diya',
    lastName: 'Patel',
    gender: 'Female',
    mobileNumber: '+91-9876543211',
    email: 'diya@example.com',
    type: 'Student',
    school: 'OI-456-Oakridge International',
    status: 'Active',
    schoolUniqueId: 'JSN-456',
    address: '789 Ocean Drive',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    fatherName: 'Rajesh Patel',
    motherName: 'Priya Patel',
    admissionNumber: 'S-54321',
    dateOfBirth: '2010-02-15',
    permanentEducationNumber: '1234567890',
  },
  usr_5e88488a7558f62f3e36f4d9: {
    id: 'usr_5e88488a7558f62f3e36f4d9',
    firstName: 'Rohan',
    lastName: 'Gupta',
    gender: 'Male',
    mobileNumber: '+91-9876543212',
    email: 'rohan@example.com',
    type: 'School Admin',
    school: 'DPS-789-Delhi Public School',
    status: 'Inactive',
    schoolUniqueId: 'JSN-789',
    address: '101 River Road',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    employeeId: 'A-456',
    joiningDate: '2020-01-10',
    experience: '8 years',
  },
};

const SCHOOLS = [
  { schoolId: 'GH-123', schoolName: 'Greenwood High' },
  { schoolId: 'GH-124', schoolName: 'Greenwood High' },
  { schoolId: 'OI-456', schoolName: 'Oakridge International' },
  { schoolId: 'DPS-789', schoolName: 'Delhi Public School' },
];

export const dynamicParams = false;
export async function generateStaticParams() {
  return ALL_USER_IDS.map((id) => ({ id }));
}
export const dynamic = 'error';

export default async function Page({ params }: { params: { id: string } }) {
  const user = USERS[params.id];
  if (!user) return notFound();

  const EditUserClient = (await import('./EditUserClient')).default;
  return <EditUserClient initialUser={user} schools={SCHOOLS} />;
}


// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const formSchema = z.object({
//   type: z.enum(['Teacher', 'Student', 'School Admin']),
//   firstName: z.string().min(1, 'First Name is required'),
//   lastName: z.string().min(1, 'Last Name is required'),
//   gender: z.enum(['Male', 'Female']),
//   mobileNumber: z.string().max(12, 'Mobile number cannot exceed 12 digits'),
//   email: z.string().email(),
//   school: z.string().min(1, 'School is required'),
//   status: z.enum(['Active', 'Inactive', 'Pending']).default('Pending'),
//   schoolUniqueId: z.string().min(1, 'School Unique ID is required'),
//   address: z.string(),
//   city: z.string(),
//   district: z.string(),
//   state: z.string(),
//   pincode: z.string(),
//   // Teacher fields
//   employeeId: z.string().optional(),
//   joiningDate: z.string().optional(),
//   experience: z.string().optional(),
//   // Student fields
//   fatherName: z.string().optional(),
//   motherName: z.string().optional(),
//   admissionNumber: z.string().optional(),
//   dateOfBirth: z.string().optional(),
//   permanentEducationNumber: z.string().optional(),
//   // School Admin fields
//   expiryDate: z.string().optional(),
// });

// // Mock user data - in a real app, you would fetch this based on the user ID
// const user = {
//     id: 1,
//     firstName: 'Liam',
//     lastName: 'Johnson',
//     gender: 'Male',
//     mobileNumber: '9876543210',
//     email: 'liam@example.com',
//     type: 'Teacher',
//     school: 'GH-123-Greenwood High',
//     status: 'Active',
//     schoolUniqueId: 'GH-1234',
//     address: '123 Main St',
//     city: 'Bangalore',
//     district: 'Bangalore Urban',
//     state: 'Karnataka',
//     pincode: '560001',
//     employeeId: 'T-123',
//     joiningDate: '2022-08-15',
//     experience: '5 years',
// };

// export default function EditUserPage() {
//   const router = useRouter();
//   const [schools, setSchools] = useState<{ schoolId: string; schoolName: string }[]>([]);

//   useEffect(() => {
//     // Mock fetching school data
//     const mockSchoolData = [
//         { schoolId: 'GH-123', schoolName: 'Greenwood High' },
//         { schoolId: 'GH-124', schoolName: 'Greenwood High' },
//         { schoolId: 'OI-456', schoolName: 'Oakridge International' },
//         { schoolId: 'DPS-789', schoolName: 'Delhi Public School' },
//     ];
//     setSchools(mockSchoolData);
//   }, []);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: user,
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//     // Here you would typically call an API to update the user data
//     router.push('/dashboard/users');
//   }

//   const type = form.watch('type');

//   return (
//     <div className="space-y-6">
//         <Card>
//             <CardHeader>
//                 <CardTitle>Edit User</CardTitle>
//             </CardHeader>
//         </Card>

//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <Card>
//                     <CardHeader>
//                         <h3 className="text-lg font-bold">General Information</h3>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             <FormField
//                                 control={form.control}
//                                 name="firstName"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>First Name *</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., John" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="lastName"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Last Name *</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., Doe" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="gender"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Gender *</FormLabel>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                     <FormControl>
//                                         <SelectTrigger>
//                                         <SelectValue placeholder="Select a gender" />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         <SelectItem value="Male">Male</SelectItem>
//                                         <SelectItem value="Female">Female</SelectItem>
//                                     </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="mobileNumber"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Mobile Number *</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., 9876543210" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="email"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>E-Mail *</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., john.doe@example.com" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="type"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Type *</FormLabel>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                     <FormControl>
//                                         <SelectTrigger>
//                                         <SelectValue placeholder="Select a type" />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         <SelectItem value="Teacher">Teacher</SelectItem>
//                                         <SelectItem value="Student">Student</SelectItem>
//                                         <SelectItem value="School Admin">School Admin</SelectItem>
//                                     </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="status"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Status</FormLabel>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                     <FormControl>
//                                         <SelectTrigger>
//                                         <SelectValue placeholder="Select a status" />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         <SelectItem value="Active">Active</SelectItem>
//                                         <SelectItem value="Inactive">Inactive</SelectItem>
//                                         <SelectItem value="Pending">Pending</SelectItem>
//                                     </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <h3 className="text-lg font-bold">School Information</h3>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             <FormField
//                                 control={form.control}
//                                 name="school"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>School *</FormLabel>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                     <FormControl>
//                                         <SelectTrigger>
//                                         <SelectValue placeholder="Select a school" />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         {schools.map((school, index) => (
//                                         <SelectItem key={index} value={`${school.schoolId}-${school.schoolName}`}>
//                                             {`${school.schoolId}-${school.schoolName}`}
//                                         </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="schoolUniqueId"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>School Unique ID *</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., GH-1234" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <h3 className="text-lg font-bold">Address Information</h3>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             <FormField
//                                 control={form.control}
//                                 name="address"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Address</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., 123 Main St" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="city"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>City</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., Bangalore" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="district"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>District</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., Bangalore Urban" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="state"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>State</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., Karnataka" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="pincode"
//                                 render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Pincode</FormLabel>
//                                     <FormControl>
//                                     <Input placeholder="e.g., 560001" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {type === 'Teacher' && (
//                     <Card>
//                         <CardHeader>
//                             <h3 className="text-lg font-bold">Teacher Details</h3>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                                 <FormField
//                                     control={form.control}
//                                     name="employeeId"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Employee ID *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., T-123" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="joiningDate"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Joining Date *</FormLabel>
//                                         <FormControl>
//                                         <Input type="date" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="experience"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Experience *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., 5 years" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {type === 'Student' && (
//                     <Card>
//                         <CardHeader>
//                             <h3 className="text-lg font-bold">Student Details</h3>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                                 <FormField
//                                     control={form.control}
//                                     name="fatherName"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Father Name/Guardian Name *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., Robert Doe" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="motherName"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Mother Name *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., Maria Doe" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="admissionNumber"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Admission Number *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., S-54321" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="dateOfBirth"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Date of Birth *</FormLabel>
//                                         <FormControl>
//                                         <Input type="date" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="permanentEducationNumber"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Permanent Education Number (PEN) *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., 1234567890" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {type === 'School Admin' && (
//                     <Card>
//                         <CardHeader>
//                             <h3 className="text-lg font-bold">School Admin Details</h3>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                                 <FormField
//                                     control={form.control}
//                                     name="employeeId"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Employee ID *</FormLabel>
//                                         <FormControl>
//                                         <Input placeholder="e.g., A-123" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="joiningDate"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Joining Date *</FormLabel>
//                                         <FormControl>
//                                         <Input type="date" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="expiryDate"
//                                     render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Expiry Date *</FormLabel>
//                                         <FormControl>
//                                         <Input type="date" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                     )}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}
//                 <div className="flex gap-4">
//                     <Button type="submit">Update User</Button>
//                     <Button variant="outline" onClick={() => router.push('/dashboard/users')}>Cancel</Button>
//                 </div>
//             </form>
//         </Form>
//     </div>
//   );
// }
