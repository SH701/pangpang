"use client";

import Logout from "@/components/logout";
import { useUser } from "@clerk/nextjs";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

function formatDate(iso?: string | Date | null) {
  if (!iso) return "";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return d.toLocaleString("en-US", opts);
}

export default function Profile() {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return <div>로딩중....</div>;
  if (!isSignedIn || !user) return <div>로그인 필요</div>;

  const name = `${user.lastName || ""}${user.firstName || ""}`.trim() || "익명";
  const joined = formatDate(user.createdAt);

  return (
    <div className="relative flex flex-col items-center gap-4 px-6 py-8">
      <Link href="/profile/setting" aria-label="설정">
            <Cog6ToothIcon
              className="
                w-6 h-6 text-gray-400 
                absolute -top-1 -right-10 
                cursor-pointer 
                transition-transform duration-500 
                hover:rotate-180 hover:text-gray-200
              "
            />
          </Link>
      <div className="relative flex flex-col items-center">
        <div className="relative inline-block">
          <h1 className="text-3xl font-bold text-center">{name}</h1>
         
        </div>
        <div className="text-xs text-gray-400 mt-1">Joined {joined}</div>
        <Logout/>
      </div>

      <div className="flex flex-col items-center justify-center">
        <span className="text-sm text-gray-400">Your Lifetime Highlights</span>
        <div className="border rounded-2xl p-10 mt-2 w-full">아래 내용들</div>
        <div className="border rounded-2xl p-10 w-full mt-4">아래 내용들</div>
        <div className="border rounded-2xl p-10 w-full mt-4">아래 내용들</div>
      </div>
    </div>
  );
}
