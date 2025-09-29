
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
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  mobile: z.string().min(10, 'Mobile number must be 10 digits.'),
  email: z.string().email('Invalid email address.'),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  profilePic: z.any().optional(),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      email: `${user?.name.toLowerCase().replace(' ', '.')}@example.com` || '',
      gender: '',
      address: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    },
  });

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
  };

  if (!user) return null;

  const baseName = user.name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/, '');
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
                      : user.profilePic
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
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-muted-foreground">{user.role}</p>
              {user.role === 'Student' && (
                <p className="text-muted-foreground">{user.class}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="personal">
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
                          <Input {...field} />
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
                        <FormControl>
                          <Input {...field} />
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
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(user.role === 'School Admin' || user.role === 'Teacher') && (
                <>
                  <div>
                    <p className="font-semibold">School ID</p>
                    <p>SC-12345</p>
                  </div>
                  <div>
                    <p className="font-semibold">School Name</p>
                    <p>Greenwood High</p>
                  </div>
                  <div>
                    <p className="font-semibold">Employee ID</p>
                    <p>EMP-54321</p>
                  </div>
                  <div>
                    <p className="font-semibold">Joining Date</p>
                    <p>2020-08-15</p>
                  </div>
                  <div>
                    <p className="font-semibold">Experience</p>
                    <p>5 years</p>
                  </div>
                </>
              )}
              {user.role === 'Student' && (
                <>
                  <div>
                    <p className="font-semibold">School ID</p>
                    <p>SC-12345</p>
                  </div>
                  <div>
                    <p className="font-semibold">School Name</p>
                    <p>Greenwood High</p>
                  </div>
                  <div>
                    <p className="font-semibold">Class</p>
                    <p>{user.class}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Section</p>
                    <p>{user.section}</p>
                  </div>
                </>
              )}
            </CardContent>
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
    </div>
  );
}
