'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';

const mobileSchema = z.object({
  mobile: z.string().min(10, 'Mobile number must be 10 digits.'),
});
const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits.'),
});
const passwordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters.'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
});

type Step = 'mobile' | 'otp' | 'password';

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('mobile');
  const { toast } = useToast();
  const router = useRouter();

  const mobileForm = useForm<z.infer<typeof mobileSchema>>({ resolver: zodResolver(mobileSchema) });
  const otpForm = useForm<z.infer<typeof otpSchema>>({ resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  const handleMobileSubmit = (data: z.infer<typeof mobileSchema>) => {
    console.log(data);
    toast({ title: 'OTP Sent', description: 'An OTP has been sent to your mobile.' });
    setStep('otp');
  };

  const handleOtpSubmit = (data: z.infer<typeof otpSchema>) => {
    console.log(data);
    if(data.otp === '123456') {
        toast({ title: 'OTP Verified', description: 'Please set your new password.' });
        setStep('password');
    } else {
        toast({ variant: 'destructive', title: 'Invalid OTP', description: 'The OTP you entered is incorrect.' });
    }
  };
  
  const handlePasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    console.log(data);
    toast({ title: 'Password Reset Successful', description: 'You can now log in with your new password.' });
    router.push('/login');
  };

  return (
    <Card>
      <CardContent className="p-6">
        {step === 'mobile' && (
          <Form {...mobileForm}>
            <form onSubmit={mobileForm.handleSubmit(handleMobileSubmit)} className="space-y-4">
              <FormField
                control={mobileForm.control}
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
              <Button type="submit" className="w-full">Send OTP</Button>
            </form>
          </Form>
        )}
        {step === 'otp' && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Verify OTP</Button>
            </form>
          </Form>
        )}
        {step === 'password' && (
           <Form {...passwordForm}>
             <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Reset Password</Button>
             </form>
           </Form>
        )}
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link href="/login" className="text-sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Sign In
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
