"use client"

import { 
  HomeIcon as SolidHomeIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon, 
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import { 
  HomeIcon as OutlineHomeIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  UserIcon as OutlineUserIcon, 
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed bottom-0
        w-full max-w-[640px] mx-auto
        border-t border-neutral-600
        bg-neutral-800
        px-5 py-3
        grid grid-cols-3
        *:text-white
        z-50
      "
    >
        <Link href="/main" className="flex flex-col items-center space-y-1">
        {pathname === "/main" 
          ? <SolidChatIcon className="size-8" /> 
          : <OutlineChatIcon className="size-8" />}
        <span className="text-xs">채팅</span>
      </Link>
      <Link href="/history" className="flex flex-col items-center space-y-1">
        {pathname === "/history" 
          ? <SolidHomeIcon className="size-8" /> 
          : <OutlineHomeIcon className="size-8" />}
        <span className="text-xs">히스토리</span>
      </Link>

      <Link href="/profile" className="flex flex-col items-center space-y-1">
        {pathname === "/profile" 
          ? <SolidUserIcon className="size-8" /> 
          : <OutlineUserIcon className="size-8" />}
        <span className="text-xs">프로필</span>
      </Link>
    </div>
  )
}