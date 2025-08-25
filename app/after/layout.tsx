import { AuthProvider } from "@/lib/UserContext";

export const metadata = { title: "Setting" };

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen">{children}</div>
    </AuthProvider>
  );
}
