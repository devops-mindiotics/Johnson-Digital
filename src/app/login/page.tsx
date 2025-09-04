
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="https://picsum.photos/1600/1200?q=40"
        alt="Login background"
        data-ai-hint="library students"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
           <CardContent className="p-6 sm:p-8">
             <div className="space-y-6">
                <div className="text-center">
                    <Logo className="mb-2 justify-center" />
                    <p className="text-sm text-muted-foreground">
                        from Johnson Digital
                    </p>
                </div>
                <LoginForm />
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
