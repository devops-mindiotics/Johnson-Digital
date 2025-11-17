'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { usePdfViewer } from '@/hooks/use-pdf-viewer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const FormSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const { login } = useAuth();
  const { openPdf } = usePdfViewer();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: '',
      password: '',
    },
  });

  const showErrorDialog = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setIsErrorDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const response = await loginUser(values.mobile, values.password);
      if (response.success) {
        login(response.data);
      } else {
        showErrorDialog('Login Failed', response.message);
      }
    } catch (error: any) {
        console.log('🚀 Unable to login. Please check your credentials.', { error });
        const description = error.response?.data?.message || 'Unable to login. Please check your credentials.';
        showErrorDialog('Login Failed', description);
    }
  };

  return (
    <div className="relative w-full h-full pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    type="tel"
                    {...field}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^[0-9]*$/.test(value)) {
                        field.onChange(e);
                      }
                    }}
                  />
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="-mt-4 text-right">
            <Button variant="link" asChild className="p-0 h-auto">
                <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot Password?</a>
            </Button>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {'Sign In'}
          </Button>
        </form>
      </Form>
      <div className="pt-4 text-center text-xs text-muted-foreground">
        <p>
          By signing in, you agree to our{" "}
          <button type="button" onClick={() => openPdf('https://storage.googleapis.com/johnson-documents/EULA-JohnsonDigital.pdf', 'End User License Agreement')} className="text-primary hover:underline">EULA</button>
          {", "}
          <button type="button" onClick={() => openPdf('https://storage.googleapis.com/johnson-documents/PrivacyPolicy-JohnsonDigital.pdf', 'Privacy Policy')} className="text-primary hover:underline">Privacy Policy</button>
          {" and "}
          <button type="button" onClick={() => openPdf('https://storage.googleapis.com/johnson-documents/TnC-JohnsonDigital.pdf', 'Terms & Conditions')} className="text-primary hover:underline">Terms & Conditions</button>
          .
        </p>
      </div>
      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{errorTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsErrorDialogOpen(false)}>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
