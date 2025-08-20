import { AuthProvider } from "@/lib/UserContext";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="h-[812px] w-[375px] mx-auto bg-white overflow-y-hidden">
        {children}
      </div>
    </AuthProvider>
  );
}
