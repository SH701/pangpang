"use client";

import {
  HomeIcon as OutlineHomeIcon,
  ClockIcon as OutlineClockIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatInputWrapper from "../chat/chatinputwrapper";
import Image from "next/image";
import { useState } from "react";

export default function TabBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const onClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="fixed bottom-0 inset-x-0 flex justify-center bg-transparent ">
      <div className="w-[381px] bg-white rounded-t-2xl shadow-[0_-4px_10px_0_rgba(0,0,0,0.08)] border border-gray-100">
        {pathname === "/main" && (
          <div className=" px-4 mb-4 relative">
            {open && (
              <Image
                src="/etc/honorific.png"
                alt="honorific"
                width={124}
                height={33}
                className="absolute -top-3.5 left-6.5"
                onClick={onClick}
              />
            )}
            <ChatInputWrapper />
          </div>
        )}
        <div className="grid grid-cols-3">
          <Link
            href="/main"
            className="flex-1 flex flex-col items-center justify-center py-4"
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
            className="flex-1 flex flex-col items-center justify-center py-4"
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
            className="flex-1 flex flex-col items-center justify-center py-4"
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
      </div>
    </div>
  );
}
