
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-center">
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md">
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
