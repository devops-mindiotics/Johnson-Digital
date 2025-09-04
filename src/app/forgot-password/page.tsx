import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { Logo } from '@/components/logo';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
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
  );
}
