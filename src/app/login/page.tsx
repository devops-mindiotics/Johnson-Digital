
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo className="mb-4 justify-center" />
          <h1 className="text-xl font-bold">Johnson Digital</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
