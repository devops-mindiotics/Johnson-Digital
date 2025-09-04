
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-primary/10 p-10 dark:bg-muted/20 relative">
         <Image 
            src="https://picsum.photos/1200/1600?q=40" 
            alt="EduCentral platform" 
            fill 
            className="object-cover"
            data-ai-hint="digital learning students" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 text-center text-primary-foreground max-w-md">
            <h2 className="text-4xl font-bold">Unlock the Future of Education</h2>
            <p className="mt-4 text-lg">A seamless digital experience for students, teachers, and administrators.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
              <Logo className="mb-2 justify-center" />
              <p className="text-sm text-muted-foreground">
                  from Johnson Digital
              </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
