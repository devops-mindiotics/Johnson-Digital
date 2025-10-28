'use client';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from "next/link";

const formSchema = z.object({
  schoolName: z.string().min(1, 'School Name is required'),
  trustSocietyName: z.string(),
  schoolBoard: z.enum(['State Board', 'CBSE', 'ICSE']),
  schoolType: z.enum(['Co-Education', 'Girls', 'Boys']),
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

type FormValues = z.infer<typeof formSchema>;
type SchoolItem = { id: string; schoolName: string; johnsonSchoolId: string };

export default function EditSchoolClient({
  initialSchool,
  schoolList,
}: {
  initialSchool: FormValues;
  schoolList: SchoolItem[];
}) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialSchool,
  });

  // ensure form syncs when route (prebuilt page) is navigated to
  useEffect(() => {
    form.reset(initialSchool);
  }, [initialSchool, form]);

  async function onSubmit(values: FormValues) {
    console.log('Updated school data:', values);
    router.push('/homepage/schools');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit School</h1>
          <Link href="/homepage/schools">
            <Button variant="outline">Back to Schools</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Basic details about the school.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* --- keep all your existing fields exactly as before --- */}
              {/* School Name */}
              <FormField control={form.control} name="schoolName" render={({ field }) => (
                <FormItem><FormLabel>School Name *</FormLabel><FormControl><Input placeholder="e.g., Greenwood High" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              {/* Trust/Society */}
              <FormField control={form.control} name="trustSocietyName" render={({ field }) => (
                <FormItem><FormLabel>Trust/Society Name</FormLabel><FormControl><Input placeholder="e.g., Greenwood Educational Trust" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              {/* Board */}
              <FormField control={form.control} name="schoolBoard" render={({ field }) => (
                <FormItem>
                  <FormLabel>School Board *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a school board" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              {/* Type */}
              <FormField control={form.control} name="schoolType" render={({ field }) => (
                <FormItem>
                  <FormLabel>School Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a school type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Co-Education">Co-Education</SelectItem>
                      <SelectItem value="Girls">Girls</SelectItem>
                      <SelectItem value="Boys">Boys</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              {/* Affiliation */}
              <FormField control={form.control} name="affiliationNo" render={({ field }) => (
                <FormItem><FormLabel>Affiliation No./School Code</FormLabel><FormControl><Input placeholder="e.g., CBSE/AFF/12345" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              {/* Logo */}
              <FormField control={form.control} name="schoolLogo" render={() => (
                <FormItem><FormLabel>School Logo</FormLabel><FormControl><Input type="file" /></FormControl><FormMessage /></FormItem>
              )}/>
              {/* Website */}
              <FormField control={form.control} name="schoolWebsite" render={({ field }) => (
                <FormItem><FormLabel>School Website</FormLabel><FormControl><Input placeholder="https://www.school.com" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              {/* Status */}
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              {/* Expiry Date */}
              <FormField control={form.control} name="expiryDate" render={({ field }) => (
                <FormItem><FormLabel>Expiry Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              {/* Is Branch */}
              <FormField control={form.control} name="isBranch" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5"><FormLabel className="text-base">Is this a Branch of Another School? *</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}/>
              {/* Parent School (conditional) */}
              {form.watch('isBranch') && (
                <FormField control={form.control} name="parentSchool" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent School</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a parent school" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {schoolList.map(s => (
                          <SelectItem key={s.id} value={`${s.johnsonSchoolId}-${s.schoolName}`}>
                            {s.johnsonSchoolId} - {s.schoolName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact, Address, Social, Audit sections (unchanged) */}
        {/* ... paste all your remaining sections here unchanged ... */}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push('/homepage/schools')}>Cancel</Button>
          <Button type="submit">Update School</Button>
        </div>
      </form>
    </Form>
  );
}
