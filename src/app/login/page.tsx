import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
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
  );
}
