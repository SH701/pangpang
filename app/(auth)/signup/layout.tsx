import { SignupProvider } from '@/lib/signup-context';

export const metadata = { title: 'Sign up' };

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <SignupProvider>
      <div className="min-h-screen bg-white">{children}</div>
    </SignupProvider>
  );
}
