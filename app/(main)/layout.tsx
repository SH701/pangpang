import TabBar from "@/components/etc/tab-bar";
import { AuthProvider } from "@/lib/UserContext";

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
    <div className="w-full flex flex-col overflow-hidden">
      <div className=" flex items-center justify-center">
        {children}
      </div>
      
      <div className="sticky bottom-0 w-full">
        <TabBar />
      </div>
    </div>
    </AuthProvider>
  );
}
