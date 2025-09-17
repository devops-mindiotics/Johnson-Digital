'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

const classes = [
    { id: 'nursery', label: 'Nursery' },
    { id: 'lkg', label: 'LKG' },
    { id: 'ukg', label: 'UKG' },
    { id: '1', label: 'I' },
    { id: '2', label: 'II' },
    { id: '3', label: 'III' },
    { id: '4', label: 'IV' },
    { id: '5', label: 'V' },
];

const seriesOptions = [
    { id: 'mirac', label: 'Mirac' },
    { id: 'marvel', label: 'Marvel' },
    { id: 'other', label: 'Other' },
];

const classConfigurationSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  sections: z.coerce.number().min(1, 'Number of sections is required'),
  series: z.string().min(1, 'Series is required'),
});

const formSchema = z.object({
  schoolName: z.string().min(1, 'School Name is required'),
  trustSocietyName: z.string().optional(),
  schoolBoard: z.enum(['State Board', 'CBSE', 'ICSE']),
  affiliationNo: z.string().optional(),
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
  totalTeachers: z.coerce.number().min(0, 'Total teachers must be a positive number'),
  totalStudents: z.coerce.number().min(0, 'Total students must be a positive number'),
  classConfigurations: z.array(classConfigurationSchema),
});

const mockSchoolData = {
  id: 'sch_1',
  schoolName: 'Greenwood High',
  trustSocietyName: 'Greenwood Educational Trust',
  schoolBoard: 'CBSE' as const,
  affiliationNo: 'CBSE/AFF/12345',
  schoolWebsite: 'https://www.greenwoodhigh.edu',
  status: 'Active' as const,
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
  totalTeachers: 50,
  totalStudents: 500,
  classConfigurations: [
    { class: 'nursery', sections: 2, series: 'mirac' },
    { class: 'lkg', sections: 2, series: 'marvel' },
    { class: 'ukg', sections: 2, series: 'other' },
    { class: '1', sections: 3, series: 'mirac' },
    { class: '2', sections: 3, series: 'marvel' },
  ],
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
  {
    id: 'sch_5',
    schoolName: 'Oakridge International School',
    johnsonSchoolId: 'JSN-124',
  },
  {
    id: 'sch_6',
    schoolName: 'Delhi Public School',
    johnsonSchoolId: 'JSN-125',
  },
];

export default function SchoolEditPage({ params }: { params: { id: string } }) {
  const [schools, setSchools] = useState<{ id: string; schoolName: string; johnsonSchoolId: string; }[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { classConfigurations: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "classConfigurations",
  });

  useEffect(() => {
    // In a real application, you would fetch the school data based on the id
    form.reset(mockSchoolData);
    setSchools(mockSchoolList);
  }, [form, params.id]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Updated school data:', values);
    // Here you would typically send the updated data to your backend API
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit School</h1>
          <Link href={`/dashboard/schools/view`}>
              <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Basic details about the school.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
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
              name="isBranch"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Is this a Branch?</FormLabel>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Licence Information</CardTitle>
            <CardDescription>Details about the school's licence.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                  control={form.control}
                  name="totalTeachers"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Total Teachers</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 50" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="totalStudents"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Total Students</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 500" {...field} />
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
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle>Class Configuration</CardTitle>
              <CardDescription>Manage the classes and sections for this school.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name={`classConfigurations.${index}.class`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`classConfigurations.${index}.series`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Series</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a series" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {seriesOptions.map((s) => (
                              <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`classConfigurations.${index}.sections`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Licences</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ class: '', sections: 1, series: '' })}
                className="mt-4 w-full md:w-auto"
              >
                Add Class
              </Button>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Key personnel contact details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
            <CardDescription>The school's physical location.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Links to the school's social media profiles.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href={`/dashboard/schools/view`}>
              <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">Update School</Button>
        </div>
      </form>
    </Form>
  );
}
