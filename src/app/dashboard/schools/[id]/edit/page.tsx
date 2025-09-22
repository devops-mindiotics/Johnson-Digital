// 'use client';

// import { useEffect, useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { PlusCircle, Trash2 } from 'lucide-react';
// import { DatePicker } from '@/components/ui/date-picker';

// // Define the schema for a single class configuration
// const classConfigurationSchema = z.object({
//   className: z.string().min(1, 'Class name is required'),
//   sections: z.array(z.string().min(1, 'Section name cannot be empty')).min(1, 'At least one section is required'),
//   subjects: z.array(z.string().min(1, 'Subject name cannot be empty')).min(1, 'At least one subject is required'),
// });

// // Define the main form schema
// const schoolFormSchema = z.object({
//     schoolName: z.string().min(1, 'School name is required'),
//     trustSocietyName: z.string().min(1, 'Trust/Society name is required'),
//     schoolBoard: z.enum(['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'], { required_error: 'School board is required' }),
//     affiliationNo: z.string().min(1, 'Affiliation number is required'),
//     schoolWebsite: z.string().url('Invalid website URL'),
//     status: z.enum(['Active', 'Inactive', 'Pending'], { required_error: 'Status is required' }),
//     expiryDate: z.string().min(1, 'Expiry date is required'),
//     email: z.string().email('Invalid email address'),
//     principalName: z.string().min(1, 'Principal name is required'),
//     principalMobile: z.string().regex(/^\d{10}$/, 'Principal mobile must be 10 digits'),
//     inchargeName: z.string().optional(),
//     inchargeMobile: z.string().regex(/^\d{10}$/, 'In-charge mobile must be 10 digits').optional(),
//     address: z.string().min(1, 'Address is required'),
//     city: z.string().min(1, 'City is required'),
//     district: z.string().min(1, 'District is required'),
//     state: z.string().min(1, 'State is required'),
//     pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
//     isBranch: z.boolean().default(false),
//     parentSchool: z.string().optional(),
//     instagram: z.string().url().optional(),
//     linkedIn: z.string().url().optional(),
//     johnsonSchoolId: z.string(),
//     createdOn: z.string(),
//     createdBy: z.string(),
//     modifiedOn: z.string(),
//     modifiedBy: z.string(),
//     totalTeachers: z.coerce.number().min(0, 'Total teachers must be a positive number'),
//     totalStudents: z.coerce.number().min(0, 'Total students must be a positive number'),
//     classConfigurations: z.array(classConfigurationSchema),
//   });

//   const mockSchoolData = {
//     id: 'sch_1',
//     schoolName: 'Greenwood High',
//     trustSocietyName: 'Greenwood Educational Trust',
//     schoolBoard: 'CBSE' as const,
//     affiliationNo: 'CBSE/AFF/12345',
//     schoolWebsite: 'https://www.greenwoodhigh.edu',
//     status: 'Active' as const,
//     expiryDate: '2025-12-31',
//     email: 'admin@greenwoodhigh.edu',
//     principalName: 'Dr. Anjali Sharma',
//     principalMobile: '9876543210',
//     inchargeName: 'Mr. Rajesh Kumar',
//     inchargeMobile: '9876543211',
//     address: '123, Education Lane',
//     city: 'Metropolis',
//     district: 'Metropolis District',
//     state: 'California',
//     pincode: '560087',
//     isBranch: true, // Set to true to show the parent school dropdown
//     parentSchool: 'JSN-124-Oakridge International School', // Example parent school ID
//     instagram: 'https://instagram.com/greenwoodhigh',
//     linkedIn: 'https://www.linkedin.com/school/greenwoodhigh',
//     johnsonSchoolId: 'JSN-123',
//     createdOn: '2023-01-15T10:00:00Z',
//     createdBy: 'Super Admin',
//     modifiedOn: '2024-05-20T14:30:00Z',
//     modifiedBy: 'Admin User',
//     totalTeachers: 50,
//     totalStudents: 1200,
//     classConfigurations: [
//       {
//         className: '10',
//         sections: ['A', 'B', 'C'],
//         subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
//       },
//       {
//         className: '9',
//         sections: ['A', 'B'],
//         subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'French'],
//       },
//     ],
//   };

// export default function EditSchoolPage({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const [isLoading, setIsLoading] = useState(true);

//   const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<z.infer<typeof schoolFormSchema>>({
//     resolver: zodResolver(schoolFormSchema),
//     defaultValues: {},
//   });
  
//   useEffect(() => {
//     setIsLoading(true);
//     new Promise(resolve => {
//         setTimeout(() => {
//           reset(mockSchoolData);
//           setIsLoading(false);
//         }, 1000);
//       });
//   }, [reset]);


//   const isBranch = watch('isBranch');

//   const onSubmit = (data: z.infer<typeof schoolFormSchema>) => {
//     console.log('Form submitted:', data);
//     // Handle form submission logic here (e.g., API call)
//   };

//   // Handle class configuration changes
//   const [classConfigs, setClassConfigs] = useState(mockSchoolData.classConfigurations);

//   const addClassConfig = () => {
//     const newClassConfigs = [...classConfigs, { className: '', sections: [''], subjects: [''] }];
//     setClassConfigs(newClassConfigs);
//     setValue('classConfigurations', newClassConfigs);
//   };

//   const removeClassConfig = (index: number) => {
//     const newClassConfigs = classConfigs.filter((_, i) => i !== index);
//     setClassConfigs(newClassConfigs);
//     setValue('classConfigurations', newClassConfigs);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>; // Or a skeleton loader
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Edit School Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             {/* School Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="schoolName">School Name</Label>
//                 <Input id="schoolName" {...register('schoolName')} />
//                 {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName.message}</p>}
//               </div>
//               {/* ... other fields ... */}
//             </div>

//             <Separator />

//             {/* Class Configurations */}
//             <div>
//               <h3 className="text-lg font-medium">Class Configurations</h3>
//               {classConfigs.map((config, index) => (
//                 <div key={index} className="space-y-4 p-4 border rounded-md mt-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="font-semibold">Class {index + 1}</h4>
//                     <Button type="button" variant="ghost" size="icon" onClick={() => removeClassConfig(index)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   {/* ... class config fields ... */}
//                 </div>
//               ))}
//               <Button type="button" variant="outline" className="mt-4" onClick={addClassConfig}>
//                 <PlusCircle className="mr-2 h-4 w-4" /> Add Class
//               </Button>
//             </div>

//             <Separator />

//             <div className="flex justify-end space-x-4">
//               <Button type="button" variant="outline">Cancel</Button>
//               <Button type="submit">Save Changes</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
'use client';
import { useRouter } from "next/navigation";


import { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  schoolName: z.string().min(1, 'School Name is required'),
  trustSocietyName: z.string(),
  schoolBoard: z.enum(['State Board', 'CBSE', 'ICSE']),
  affiliationNo: z.string(),
  schoolLogo: z.any(),
  schoolWebsite: z.string().url().optional(),
  status: z.enum(['Active', 'Inactive', 'Pending', 'Trial']).default('Pending'),
  expiryDate: z.string().min(1, 'Expiry Date is required'),
  email: z.string().email(),
  principalName: z.string().min(1, 'Principal Name is required'),
  principalMobile: z.string().min(1, 'Principal Mobile is required'),
  inchargeName: z.string().min(1, 'Incharge Name is required'),
  inchargeMobile: z.string().min(1, 'Incharge Mobile is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  isBranch: z.boolean().default(false),
  parentSchool: z.string().optional(),
  instagram: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
  johnsonSchoolId: z.string(),
  createdOn: z.string(),
  createdBy: z.string(),
  modifiedOn: z.string(),
  modifiedBy: z.string(),
});

const mockSchoolData = {
  id: 'sch_1',
  schoolName: 'Greenwood High',
  trustSocietyName: 'Greenwood Educational Trust',
  schoolBoard: 'CBSE',
  affiliationNo: 'CBSE/AFF/12345',
  schoolWebsite: 'https://www.greenwoodhigh.edu',
  status: 'Active',
  expiryDate: '2025-12-31',
  email: 'admin@greenwoodhigh.edu',
  principalName: 'Dr. Anjali Sharma',
  principalMobile: '9876543210',
  inchargeName: 'Mr. Rajesh Kumar',
  inchargeMobile: '9876543211',
  address: '123, Education Lane',
  city: 'Metropolis',
  district: 'Metropolis District',
  state: 'California',
  pincode: '560087',
  isBranch: true, // Set to true to show the parent school dropdown
  parentSchool: 'JSN-124-Oakridge International School', // Example parent school ID
  instagram: 'https://instagram.com/greenwoodhigh',
  linkedIn: 'https://linkedin.com/school/greenwoodhigh',
  johnsonSchoolId: 'JSN-123',
  createdOn: '2023-01-15T10:00:00Z',
  createdBy: 'Super Admin',
  modifiedOn: '2023-10-26T14:30:00Z',
  modifiedBy: 'Super Admin',
};

const mockSchoolList = [
  {
    id: 'sch_2',
    schoolName: 'Oakridge International School',
    johnsonSchoolId: 'JSN-124',
  },
  {
    id: 'sch_3',
    schoolName: 'Delhi Public School',
    johnsonSchoolId: 'JSN-125',
  },
  {
    id: 'sch_4',
    schoolName: 'National Public School',
    johnsonSchoolId: 'JSN-126',
  },
];

export default function SchoolEditPage({ params }: { params: { id: string } }) {
  const [schools, setSchools] = useState<{ id: string; schoolName: string; johnsonSchoolId: string; }[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mockSchoolData,
  });

  useEffect(() => {
    // In a real application, you would fetch the school data and the list of schools
    // based on the id and then reset the form with the fetched data.
    form.reset(mockSchoolData);
    setSchools(mockSchoolList);
  }, [form, params.id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Updated school data:', values);
    // Here you would typically send the updated data to your backend API
    router.push('/schools'); 
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit School Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="johnsonSchoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Johnson School ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Greenwood High" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trustSocietyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trust/Society Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Greenwood Educational Trust" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolBoard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Board *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="State Board">State Board</SelectItem>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affiliationNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliation No./School Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CBSE/AFF/12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Logo</FormLabel>
                    <FormControl>
                      <Input type="file" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.school.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Trial">Trial</SelectItem>
                      </SelectContent>
                    </Select>
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., admin@school.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="principalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="principalMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inchargeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incharge Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inchargeMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incharge Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543211" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main Street" {...field} />
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
                    <FormLabel>City *</FormLabel>
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
                    <FormLabel>District *</FormLabel>
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
                    <FormLabel>State *</FormLabel>
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
                    <FormLabel>Pincode *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 560001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isBranch"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Is this a Branch of Another School? *</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch('isBranch') && (
                <FormField
                  control={form.control}
                  name="parentSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent School</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a parent school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school.id} value={`${school.johnsonSchoolId}-${school.schoolName}`}>
                              {school.johnsonSchoolId} - {school.schoolName}
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
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/school" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/school" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createdOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created On</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modifiedOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modified On</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modifiedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modified By</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Update School</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
