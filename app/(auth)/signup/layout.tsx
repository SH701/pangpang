import { AuthProvider } from "@/lib/UserContext";

export const metadata = { title: "Sign up" };

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white overflow-hidden">{children}</div>
    </AuthProvider>
  );
}
