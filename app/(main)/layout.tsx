"use client"

import TabBar from "@/components/etc/tab-bar";
import { AuthProvider } from "@/lib/UserContext";
import { usePathname } from 'next/navigation'

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hide=[
    '/main/custom',
    '/main/role'
  ]
  const hideTabbar = hide.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  )
  return (
    <AuthProvider>
    <div className="w-full flex flex-col">
      <div className=" flex items-center justify-center">
        {children}
      </div>
      {!hideTabbar&&(<div className="sticky bottom-0 w-full">
        <TabBar />
      </div>)}
    </div>
    </AuthProvider>
  );
}
