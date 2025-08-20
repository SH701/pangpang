"use client";

import TabBar from "@/components/etc/tab-bar";
import { AuthProvider } from "@/lib/UserContext";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hide = ["/main/custom", "/main/role", "/main/honorific"];
  const hideTabbar = hide.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  return (
    <AuthProvider>
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-center w-full">
          {children}
        </div>
        {!hideTabbar && (
          <div className="fixed bottom-0 inset-x-0  z-50">
            <TabBar />
          </div>
        )}
      </div>
    </AuthProvider>
  );
}
