
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

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  mobile: z.string().min(10, 'Mobile number must be 10 digits.'),
  email: z.string().email('Invalid email address.'),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      email: `${user?.name.toLowerCase().replace(' ', '.')}@example.com` || '',
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log(values);
  };

  if (!user) return null;

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
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profilePic} alt={user.name} data-ai-hint="person avatar" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change Picture</span>
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.role}</p>
              {user.role === 'Student' && (
                <p className="text-muted-foreground">{user.class}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="school">School Details</TabsTrigger>
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
                  className="space-y-4"
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
                  <Button type="submit">Save Changes</Button>
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
            <CardContent>
              <p className="text-muted-foreground">
                School-related information will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Subscription and license details will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
