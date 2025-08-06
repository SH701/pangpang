"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image"
import { useState } from "react";
import { SettingItem } from "@/components/profile/settingitem";

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
  const [count,setCount] = useState(0)
   const [level,setLevel] = useState(0)
  if (!isLoaded) return <div>로딩중....</div>;
  if (!isSignedIn || !user) return <div>로그인 필요</div>;

  const name = `${user.unsafeMetadata.nickname}`.trim() || "익명";
  const joined = formatDate(user.createdAt);

  return (
   <>
    <span className="absolute top-12 left-4 text-2xl font-bold z-10">My Page</span>
    <div className="flex flex-col">
    <div className="relative flex flex-col items-center gap-4 px-6 py-8 bg-white">
      <div className="relative flex flex-col items-center gap-2 mt-20">
        <Image src={user?.imageUrl} alt="Profile" width={100} height={100} className="rounded-full"/>
        <h1 className="text-xl font-semibold text-center">{name}</h1>
        <Link href="/profile/edit" aria-label="설정" className="btn">
          <span className="text-sm">Edit profile</span>
        </Link>
        <div className="text-xs text-gray-400 mt-1">Joined {joined}</div>
      </div>
      <div className="w-[335px] h-25 bg-gray-300 rounded-2xl flex justify-between items-center px-10">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-semibold text-sm">Studied sentence </span>
          <span className="text-xl">{count}</span>
        </div>
        <div className="border-r-1 h-18 w-1"></div>
         <div className="flex flex-col gap-2 items-center">
          <span className="font-semibold text-sm">Korean level</span>
          <span className="text-xl">LV.{level}</span>
        </div>
      </div>
    </div>
   <div className="bg-white px-3 pt-4">
      <div className="pl-6 mb-2">
        <span className="text-lg font-semibold">Setting</span>
      </div>
      <div className="w-[335px] mx-auto overflow-hidden bg-gray-200 mb-4 border-b-1 rounded-2xl">
        <SettingItem
          icon={<span className="font-bold">Lv</span>}
          title="Difficulty Settings"
          description = {`Current : Lv ${user?.unsafeMetadata.level}`}
        />
        <SettingItem
          icon={<div className="w-8 h-8 bg-gray-400 rounded-full" />}
          title="What?"
          description="What?"
        />
        <SettingItem
          icon={<span className="text-xl">📄</span>}
          title="What?"
          description="What?"
        />
      </div>
    </div>
    </div>
  </>
  );
}
