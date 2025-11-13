'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Crown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getSchoolById, updateSchool } from '@/lib/api/schoolApi';
import Link from 'next/link';

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits.'),
  email: z.string().email('Invalid email address.'),
  gender: z.string().min(1, "Gender is required."),
  address: z.string().min(1, "Address is required."),
  city: z.string().min(1, "City is required."),
  district: z.string().min(1, "District is required."),
  state: z.string().min(1, "State is required."),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits."),
  profilePic: z.any().optional(),
});

const schoolFormSchema = z.object({
  schoolName: z.string().min(1, 'School Name is required'),
  trustName: z.string(),
  board: z.enum(['State Board', 'CBSE', 'ICSE']),
  type: z.enum(['co-education', 'girls', 'boys']),
  affiliationNo: z.string(),
  logoUrl: z.any(),
  website: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'trial']).default('pending'),
  expiryDate: z.string().min(1, 'Expiry Date is required'),
  email: z.string().email(),
  contacts: z.array(z.object({
      role: z.string(),
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
      schoolId: z.string(),
      schoolName: z.string(),
      schoolCode: z.string(),
  }).optional(),
  socialLinks: z.object({
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
  }).optional(),
  schoolCode: z.string(),
  totalTeachers: z.preprocess((val) => Number(val), z.number().min(0)),
  totalStudents: z.preprocess((val) => Number(val), z.number().min(0))
});

const SchoolDetailsReceipt = ({ school, onEdit }) => (
  <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div><p className="font-semibold">School Name</p><p>{school.schoolName}</p></div>
    <div><p className="font-semibold">School Board</p><p>{school.board}</p></div>
    <div><p className="font-semibold">Affiliation No.</p><p>{school.affiliationNo}</p></div>
    <div><p className="font-semibold">Email</p><p>{school.email}</p></div>
    <div><p className="font-semibold">Address</p><p>{`${school.address.line1}, ${school.address.city}, ${school.address.state} - ${school.address.pincode}`}</p></div>
    <div className="md:col-span-2 flex justify-end">
      <Button onClick={onEdit}>Edit</Button>
    </div>
  </CardContent>
);

const SchoolEditForm = ({ school, onCancel, user, schoolList }) => {
  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: school,
  });

  const onSubmit = async (values: z.infer<typeof schoolFormSchema>) => {
    await updateSchool(school.id, values);
    onCancel();
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormField control={form.control} name="logoUrl" render={() => (
                <FormItem><FormLabel>School Logo</FormLabel><FormControl><Input type="file" /></FormControl><FormMessage /></FormItem>
              )}/>
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
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Update School</Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

const getAvatarUrl = (user: any) => {
  if (user.avatarUrl) {
    return user.avatarUrl;
  }

  if (user.gender === 'male') {
    return 'https://avatar.iran.liara.run/public/boy';
  }

  if (user.gender === 'female') {
    return 'https://avatar.iran.liara.run/public/girl';
  }

  return 'https://avatar.iran.liara.run/public';
};

export default function ProfileClient({ user: initialUser, schoolList }: { user: any, schoolList: any[] }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [school, setSchool] = useState<any>(null);
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  
  const user = {
    ...initialUser,
    name: `${initialUser.firstName} ${initialUser.lastName}`,
    mobile: initialUser.phone,
    role: initialUser.roles?.[0]
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      gender: user?.gender || '',
      address: user?.address || '',
      city: user?.city || '',
      district: user?.district || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
    },
    mode: 'onChange',
  });

  const fetchSchoolData = async () => {
    if (!user.schools || user.schools.length === 0) {
      return;
    }
    setLoadingSchool(true);
    try {
      const schoolData = await getSchoolById(user.schools[0].schoolId);
      setSchool(schoolData);
    } catch (error) {
      console.error("Failed to fetch school data:", error);
    } finally {
      setLoadingSchool(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    if (selectedFile) {
      values.profilePic = selectedFile;
    }
    console.log(values);
    setIsSuccessDialogOpen(true);
  };

  const baseName = user?.name?.replace(/^(Dr\.|Mr\.|Ms\.)\s+/, '') ?? 'User';
  let displayName = baseName;

  if (user.role !== 'Student') {
    if (user.gender === 'male') {
      displayName = `Mr. ${baseName}`;
    } else if (user.gender === 'female') {
      displayName = `Ms. ${baseName}`;
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            View and manage your profile details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-left">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : getAvatarUrl(user)
                  }
                  alt={displayName}
                  data-ai-hint="person avatar"
                />
                <AvatarFallback>{baseName.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change Picture</span>
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{displayName}</h2>
                {user.role === 'Student' && (
                  <p className="hidden text-sm text-muted-foreground sm:block">
                      ({user.class})
                  </p>
                  )}
                  {user.role === 'Student' && (
                      <span className="flex items-center text-xs font-semibold text-black bg-yellow-400 px-2 py-1 rounded-full">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                      </span>
                  )}
              </div>
              <p className="text-muted-foreground">{user.role}</p>
              {user.role === 'Student' && (
                <p className="text-muted-foreground">{user.class}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="personal" onValueChange={(value) => {
        if (value === 'school') {
          fetchSchoolData();
        }
      }}>
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          {user.role !== 'Super Admin' && <TabsTrigger value="school">School Details</TabsTrigger>}
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); field.onChange(e); }} />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent hideSearch>
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {indianStates.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Input {...field} onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6); field.onChange(e); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Details</CardTitle>
            </CardHeader>
            {isEditingSchool ? (
              <SchoolEditForm school={school} onCancel={() => setIsEditingSchool(false)} user={user} schoolList={schoolList} />
            ) : (
              loadingSchool ? <p>Loading school details...</p> : school ? (
                <SchoolDetailsReceipt school={school} onEdit={() => setIsEditingSchool(true)} />
              ) : <p>No school details available.</p>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <div>
                <p className="font-semibold">User Type</p>
                <p>{user.role}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>Active</p>
              </div>
              <div>
                <p className="font-semibold">Created On</p>
                <p>2023-01-01</p>
              </div>
              <div>
                <p className="font-semibold">Expires On</p>
                <p>2024-01-01</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Successfully profile updated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
