
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
       <div className="hidden lg:flex items-center justify-center bg-primary/10 p-10 dark:bg-muted/20 relative">
         <Image 
            src="https://picsum.photos/1200/1600?q=41" 
            alt="EduCentral security" 
            fill 
            className="object-cover"
            data-ai-hint="digital security lock"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 text-center text-primary-foreground max-w-md">
            <h2 className="text-4xl font-bold">Secure & Simple</h2>
            <p className="mt-4 text-lg">Regain access to your account quickly and securely.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Logo className="mb-4 justify-center" />
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground">
                    No worries, we'll send you reset instructions.
                </p>
            </div>
            <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
