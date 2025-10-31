
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
                <Logo />
            </div>
            <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
