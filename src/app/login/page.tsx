
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole, User } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

const FormSchema = z.object({
  role: z.enum(['Super Admin', 'School Admin', 'Teacher', 'Student'], {
    required_error: 'Please select a role.',
  }),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const mockUsers: Record<string, Omit<User, 'mobile'>> = {
  '1111111111': { id: 'user-1', name: 'Dr. Evelyn Reed', role: 'Super Admin', profilePic: 'https://picsum.photos/100/100?q=1' },
  '2222222222': { id: 'user-2', name: 'Mr. John Smith', role: 'School Admin', profilePic: 'https://picsum.photos/100/100?q=2' },
  '3333333333': { id: 'user-3', name: 'Alice Johnson', role: 'Teacher', profilePic: 'https://picsum.photos/100/100?q=3' },
  '4444444444': { id: 'user-4', name: 'Bobby Tables', role: 'Student', profilePic: 'https://picsum.photos/100/100?q=4', class: '10th Grade' },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const userRole = data.role as UserRole;
    const mobileNumber = data.mobile;
    
    const mockUserKey = Object.keys(mockUsers).find(key => mockUsers[key].role === userRole);
    const mockUser = mockUserKey ? mockUsers[mockUserKey] : undefined;

    if (mockUser) {
      login({ ...mockUser, role: userRole, mobile: mobileNumber });
    } else {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials for the selected role.",
      });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="text-xl font-bold mt-2">Johnson Digital</h1>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Login Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="School Admin">School Admin</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Enter your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                    >
                    Forgot Password?
                    </Link>
                </Button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
