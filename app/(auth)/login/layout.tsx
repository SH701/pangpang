import { AuthProvider } from "@/lib/UserContext";

export const metadata = { title: "Setting" };

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="h-[812px] w-[375px] mx-auto bg-white overflow-hidden">
        {children}
      </div>
    </AuthProvider>
  );
}
