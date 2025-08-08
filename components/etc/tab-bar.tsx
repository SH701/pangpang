"use client";

import {
  HomeIcon as OutlineHomeIcon,
  ClockIcon as OutlineClockIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed bottom-0 inset-x-0
        bg-white
        grid grid-cols-3
      "
    >
      <Link
        href="/main"
        className="flex-1 flex flex-col items-center justify-center py-2"
      >
        {pathname === "/main" ? (
          <>
          <OutlineHomeIcon className="w-6 h-6 text-blue-500" />
          <span className="text-xs text-blue-500 mt-1">Home</span>
          </>
        ) : (
          <>
          <OutlineHomeIcon className="w-6 h-6 text-gray-300" />
          <span className="text-xs text-gray-300 mt-1">Home</span>
          </>
        )}
        
      </Link>
 <Link
        href="/chatbothistory"
        className="flex-1 flex flex-col items-center justify-center py-2"
      >
        {pathname === "/chatbothistory" ? (
          <>
          <OutlineClockIcon className="w-6 h-6 text-blue-500" />
          <span className="text-xs text-blue-500 mt-1">History</span>
          </>
        ) : (
          <>
          <OutlineClockIcon className="w-6 h-6 text-gray-300" />
          <span className="text-xs text-gray-300 mt-1">History</span>
          </>
        )}
      
      </Link>
      <Link
        href="/profile"
        className="flex-1 flex flex-col items-center justify-center py-2"
      >
        {pathname.startsWith("/profile") ? (
          <>
          <OutlineUserIcon className="w-6 h-6 text-blue-500" />
          <span className="text-xs text-blue-500 mt-1">Profile</span>
          </>
        ) : (
          <>
          <OutlineUserIcon className="w-6 h-6 text-gray-300" />
          <span className="text-xs text-gray-300 mt-1">Profile</span>
          </>
        )}
        
      </Link>
    </div>
  );
}
