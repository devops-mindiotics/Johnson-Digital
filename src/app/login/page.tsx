'use client'
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { LoginForm } from '@/components/login-form';
import { useLegalPdfViewer } from '@/hooks/use-legal-pdf-viewer';

export default function LoginPage() {
  const { openLegalPdf } = useLegalPdfViewer();

  const handleOpenPdf = (url: string, title: string) => {
    openLegalPdf(url, title);
  };

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
                        <div className="text-center text-sm pt-4">
                            <p className="text-muted-foreground mb-2">By signing in, you agree to our</p>
                            <div className="flex justify-center space-x-4">
                                <button onClick={() => handleOpenPdf('https://storage.googleapis.com/johnson-documents/EULA-JohnsonDigital.pdf', 'End User License Agreement')} className="hover:underline">EULA</button>
                                <button onClick={() => handleOpenPdf('https://storage.googleapis.com/johnson-documents/PrivacyPolicy-JohnsonDigital.pdf', 'Privacy Policy')} className="hover:underline">Privacy Policy</button>
                                <button onClick={() => handleOpenPdf('https://storage.googleapis.com/johnson-documents/TnC-JohnsonDigital.pdf', 'Terms & Conditions')} className="hover:underline">T&C</button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
