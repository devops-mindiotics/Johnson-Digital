
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { Logo } from '@/components/logo';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="https://picsum.photos/1600/1200?q=41"
        alt="Forgot password background"
        data-ai-hint="classroom books"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-8">
                <div className="text-center">
                    <Logo className="mb-4 justify-center" />
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>
                <ForgotPasswordForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
