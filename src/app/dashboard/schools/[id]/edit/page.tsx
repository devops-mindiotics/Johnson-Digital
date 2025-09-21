'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

// Define the schema for a single class configuration
const classConfigurationSchema = z.object({
  className: z.string().min(1, 'Class name is required'),
  sections: z.array(z.string().min(1, 'Section name cannot be empty')).min(1, 'At least one section is required'),
  subjects: z.array(z.string().min(1, 'Subject name cannot be empty')).min(1, 'At least one subject is required'),
});

// Define the main form schema
const schoolFormSchema = z.object({
    schoolName: z.string().min(1, 'School name is required'),
    trustSocietyName: z.string().min(1, 'Trust/Society name is required'),
    schoolBoard: z.enum(['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'], { required_error: 'School board is required' }),
    affiliationNo: z.string().min(1, 'Affiliation number is required'),
    schoolWebsite: z.string().url('Invalid website URL'),
    status: z.enum(['Active', 'Inactive', 'Pending'], { required_error: 'Status is required' }),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    email: z.string().email('Invalid email address'),
    principalName: z.string().min(1, 'Principal name is required'),
    principalMobile: z.string().regex(/^\d{10}$/, 'Principal mobile must be 10 digits'),
    inchargeName: z.string().optional(),
    inchargeMobile: z.string().regex(/^\d{10}$/, 'In-charge mobile must be 10 digits').optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    district: z.string().min(1, 'District is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
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
    linkedIn: 'https://www.linkedin.com/school/greenwoodhigh',
    johnsonSchoolId: 'JSN-123',
    createdOn: '2023-01-15T10:00:00Z',
    createdBy: 'Super Admin',
    modifiedOn: '2024-05-20T14:30:00Z',
    modifiedBy: 'Admin User',
    totalTeachers: 50,
    totalStudents: 1200,
    classConfigurations: [
      {
        className: '10',
        sections: ['A', 'B', 'C'],
        subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
      },
      {
        className: '9',
        sections: ['A', 'B'],
        subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'French'],
      },
    ],
  };

export default function EditSchoolPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {},
  });
  
  useEffect(() => {
    setIsLoading(true);
    new Promise(resolve => {
        setTimeout(() => {
          reset(mockSchoolData);
          setIsLoading(false);
        }, 1000);
      });
  }, [reset]);


  const isBranch = watch('isBranch');

  const onSubmit = (data: z.infer<typeof schoolFormSchema>) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here (e.g., API call)
  };

  // Handle class configuration changes
  const [classConfigs, setClassConfigs] = useState(mockSchoolData.classConfigurations);

  const addClassConfig = () => {
    const newClassConfigs = [...classConfigs, { className: '', sections: [''], subjects: [''] }];
    setClassConfigs(newClassConfigs);
    setValue('classConfigurations', newClassConfigs);
  };

  const removeClassConfig = (index: number) => {
    const newClassConfigs = classConfigs.filter((_, i) => i !== index);
    setClassConfigs(newClassConfigs);
    setValue('classConfigurations', newClassConfigs);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit School Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* School Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input id="schoolName" {...register('schoolName')} />
                {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName.message}</p>}
              </div>
              {/* ... other fields ... */}
            </div>

            <Separator />

            {/* Class Configurations */}
            <div>
              <h3 className="text-lg font-medium">Class Configurations</h3>
              {classConfigs.map((config, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-md mt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Class {index + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeClassConfig(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* ... class config fields ... */}
                </div>
              ))}
              <Button type="button" variant="outline" className="mt-4" onClick={addClassConfig}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Class
              </Button>
            </div>

            <Separator />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
