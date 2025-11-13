'use client'
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-center">
        <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 sm:p-12">
            <Card className="w-full max-w-md">
                <CardContent className="p-6 sm:p-8">
                <div className="space-y-4">
                    <div className="text-center">
                        <Logo className="mb-4 justify-center" />
                        <h1 className="text-2xl font-bold">Sign In</h1>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
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
