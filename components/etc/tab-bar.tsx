"use client";

import {
  HomeIcon as SolidHomeIcon,
  ClockIcon as SolidClockIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
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
          <SolidHomeIcon className="w-6 h-6 text-black" />
        ) : (
          <OutlineHomeIcon className="w-6 h-6 text-black" />
        )}
        <span className="text-xs text-black mt-1">Home</span>
      </Link>
 <Link
        href="/chatbothistory"
        className="flex-1 flex flex-col items-center justify-center py-2"
      >
        {pathname === "/chatbothistory" ? (
          <SolidClockIcon className="w-6 h-6 text-black" />
        ) : (
          <OutlineClockIcon className="w-6 h-6 text-black" />
        )}
        <span className="text-xs text-black mt-1">History</span>
      </Link>
      <Link
        href="/profile"
        className="flex-1 flex flex-col items-center justify-center py-2"
      >
        {pathname === "/profile" ? (
          <SolidUserIcon className="w-6 h-6 text-black" />
        ) : (
          <OutlineUserIcon className="w-6 h-6 text-black" />
        )}
        <span className="text-xs text-black mt-1">Profile</span>
      </Link>
    </div>
  );
}
