'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from "next/link";
import { updateSchool } from "@/lib/api/schoolApi";
import { useAuth } from "@/hooks/use-auth";
import { createAttachment, getSignedUploadUrl, getSignedViewUrl } from "@/lib/api/attachmentApi";
import { Upload } from 'lucide-react';
import './EditSchool.css';

const formSchema = z.object({
  schoolName: z.string().min(1, 'School Name is required'),
  trustName: z.string().optional(),
  board: z.enum(['State Board', 'CBSE', 'ICSE']),
  type: z.enum(['co-education', 'girls', 'boys']),
  affiliationNo: z.string(),
  logoUrl: z.any(),
  website: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'trial']).default('pending'),
  expiryDate: z.string().min(1, 'Expiry Date is required'),
  email: z.string().email(),
  contacts: z.array(z.object({
      role: z.string().optional(),
      name: z.string(),
      mobile: z.string(),
  })),
  address: z.object({
    line1: z.string(),
    city: z.string(),
    district: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  isBranch: z.boolean().default(false),
  parentSchool: z.object({
    schoolId: z.string().optional(),
    schoolName: z.string().optional(),
    schoolCode: z.string().optional(),
  }).optional(),
  socialLinks: z.object({
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
  }).optional(),
  schoolCode: z.string().optional(),
  totalTeachers: z.preprocess((val) => Number(val), z.number().min(0)),
  totalStudents: z.preprocess((val) => Number(val), z.number().min(0))
}).superRefine((data, ctx) => {
  if (data.isBranch && !data.parentSchool?.schoolId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['parentSchool.schoolId'],
      message: 'Parent School is required when it is a branch.',
    });
  }
});

type FormValues = z.infer<typeof formSchema>;
type SchoolData = FormValues & { id: string };
type SchoolItem = { id: string; schoolName: string; schoolCode: string };

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function EditSchoolClient({
  initialSchool,
  schoolList,
}: {
  initialSchool: SchoolData;
  schoolList: SchoolItem[];
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialSchool,
  });

  useEffect(() => {
    if (initialSchool) {
      const formattedSchool = {
        ...initialSchool,
        expiryDate: formatDate(initialSchool.expiryDate),
      };
      form.reset(formattedSchool);

      if (initialSchool.logoUrl) {
        getSignedViewUrl(initialSchool.logoUrl)
          .then(response => setLogoPreview(response.data.attributes.signedUrl))
          .catch(err => console.error("Error fetching logo preview:", err));
      }
    }
  }, [initialSchool, form]);

  async function onSubmit(values: FormValues) {
    console.log("Form submitted with values:", values);
    console.log("User object:", user);

    const tenantId = user?.tenant?.id ?? user?.tenantId;

    if (!tenantId) {
      console.error("Tenant ID is missing from user object:", user);
      return;
    }

    console.log("Tenant ID found:", tenantId);

    let logoUrl = initialSchool.logoUrl;

    if (selectedFile) {
      try {
        const signedUrlResponse = await getSignedUploadUrl(selectedFile, "schools");
        const { signedUrl, attachmentId, path } = signedUrlResponse.data.attributes;

        await fetch(signedUrl, {
            method: 'PUT',
            body: selectedFile,
            headers: {
                'Content-Type': selectedFile.type,
            },
        });

        await createAttachment({
            id: attachmentId,
            path: path,
            filename: selectedFile.name,
            contentType: selectedFile.type,
            name: selectedFile.name
        });

        logoUrl = attachmentId;
      } catch (error) {
        console.error("Failed to upload logo:", error);
        return; 
      }
    }

    let parentSchoolData;
    if (values.isBranch && values.parentSchool?.schoolId) {
        const selectedParentSchool = schoolList.find(s => s.id === values.parentSchool?.schoolId);
        if (selectedParentSchool) {
            parentSchoolData = {
                schoolId: selectedParentSchool.id,
                schoolName: selectedParentSchool.schoolName,
                schoolCode: selectedParentSchool.schoolCode,
            };
        }
    }

    const updatedValues = { 
      ...values, 
      logoUrl, 
      contacts: [
        { ...values.contacts[0], role: 'principal' },
        { ...values.contacts[1], role: 'incharge' },
      ],
      schoolCode: initialSchool.schoolCode,
      parentSchool: values.isBranch ? parentSchoolData : undefined,
    }; 

    try {
      await updateSchool(tenantId, initialSchool.id, { data: updatedValues });
      router.push('/homepage/schools');
    } catch (error) {
        console.error("Failed to update school:", error);
    }
  }

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    console.error("Form validation errors:", JSON.stringify(errors));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
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
              <FormField control={form.control} name="schoolName" render={({ field }) => (
                <FormItem><FormLabel>School Name *</FormLabel><FormControl><Input placeholder="e.g., Greenwood High" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="trustName" render={({ field }) => (
                <FormItem><FormLabel>Trust/Society Name</FormLabel><FormControl><Input placeholder="e.g., Greenwood Educational Trust" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="board" render={({ field }) => (
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
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>School Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a school type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="co-education">Co-Education</SelectItem>
                      <SelectItem value="girls">Girls</SelectItem>
                      <SelectItem value="boys">Boys</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="affiliationNo" render={({ field }) => (
                <FormItem><FormLabel>Affiliation No./School Code</FormLabel><FormControl><Input placeholder="e.g., CBSE/AFF/12345" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField
                control={form.control}
                name="logoUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>School Logo</FormLabel>
                    <div
                      className="file-upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FormControl>
                        <Input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/*"
                        />
                      </FormControl>
                      {logoPreview ? (
                        <div className="flex flex-col items-center gap-2">
                          <Image src={logoPreview} alt="Logo Preview" width={100} height={100} className="logo-preview" />
                          <span>{selectedFile ? selectedFile.name : 'Click to change logo'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                           <Upload className="w-8 h-8 text-muted-foreground" />
                          <span>Click to upload a logo</span>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem><FormLabel>School Website</FormLabel><FormControl><Input placeholder="https://www.school.com" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="expiryDate" render={({ field }) => (
                <FormItem><FormLabel>Expiry Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="isBranch" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5"><FormLabel className="text-base">Is this a Branch of Another School? *</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}/>
              {form.watch('isBranch') && (
                <FormField control={form.control} name="parentSchool.schoolId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent School</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a parent school" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {schoolList.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.schoolCode} - {s.schoolName}
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

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Contact details for the school's key personnel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>E-Mail *</FormLabel><FormControl><Input placeholder="e.g., admin@school.com" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="contacts[0].name" render={({ field }) => (
                  <FormItem><FormLabel>Principal Name *</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
                <FormField control={form.control} name="contacts[0].mobile" render={({ field }) => (
                    <FormItem><FormLabel>Principal Mobile Number *</FormLabel><FormControl><Input placeholder="e.g., 9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="contacts[1].name" render={({ field }) => (
                    <FormItem><FormLabel>Incharge Name *</FormLabel><FormControl><Input placeholder="e.g., Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="contacts[1].mobile" render={({ field }) => (
                    <FormItem><FormLabel>Incharge Mobile Number *</FormLabel><FormControl><Input placeholder="e.g., 9876543211" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
            <CardDescription>The school's physical location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField control={form.control} name="address.line1" render={({ field }) => (
                  <FormItem><FormLabel>Address *</FormLabel><FormControl><Input placeholder="e.g., 123 Main Street" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="address.city" render={({ field }) => (
                  <FormItem><FormLabel>City *</FormLabel><FormControl><Input placeholder="e.g., Bangalore" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="address.district" render={({ field }) => (
                  <FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="e.g., Bangalore Urban" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="address.state" render={({ field }) => (
                  <FormItem><FormLabel>State *</FormLabel><FormControl><Input placeholder="e.g., Karnataka" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="address.pincode" render={({ field }) => (
                <FormItem><FormLabel>Pincode *</FormLabel><FormControl><Input placeholder="e.g., 560001" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License Details</CardTitle>
            <CardDescription>Details about the school's license.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="totalTeachers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Teachers</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
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
                    <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Links to the school's social media profiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (
                  <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/school" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="socialLinks.linkedin" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/school" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push('/homepage/schools')}>Cancel</Button>
          <Button type="submit">Update School</Button>
        </div>
      </form>
    </Form>
  );
}
