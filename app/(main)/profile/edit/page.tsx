"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Logout from "@/components/auth/logout";
import ProfileChange from "@/components/afterlogin/profilechange";
import { useState } from "react";
import Secession from "@/components/auth/secession";


export default function Edit() {
  const { user, isLoaded } = useUser();
  const nickname = user?.unsafeMetadata.nickname as string ;
  const [name,setName] = useState(nickname)
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const birth = "00.00.00";
  const change = async()=>{
    if (!user || !name.trim()) return;
    await user.update({
      unsafeMetadata:{
        nickname:name.trim()
      }
    })
    await user.reload();
    alert("Change nickaname!!")
  }
  return (
    <div className="min-h-screen w-full max-w-md  px-6 py-8">
      <div className="relative w-full flex items-center justify-center h-12 mb-2">
        <Link href="/profile" className="absolute -left-5 top-1/2 -translate-y-1/2 px-3">
         <ChevronLeftIcon className="size-8"/>
        </Link>
        <span className="font-bold text-lg">Profile Edit</span>
      </div>
      {/* 프로필/닉네임 */}
      <div className="flex flex-col items-center gap-2 my-6">
        <ProfileChange user={user} size={100} />
      <div className="flex items-center gap-2 flex-col">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Change nickname..."
        className="border px-3 py-1 rounded w-full"
      />
      <button
        onClick={change}
        className="text-gray-600 bg-gray-100 px-4 py-1 rounded hover:bg-gray-200 cursor-pointer"
      >
        변경
      </button>
    </div>
      </div>
      {/* 구분선 */}
      <div className="w-full h-px bg-gray-200 my-2" />
      {/* 기본정보 */}
      <div className="w-full px-2">
        <div className="text-base font-semibold mb-3 mt-1">기본정보</div>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs text-gray-400">생년월일</div>
            <div className="text-sm font-medium">{birth}</div>
          </div>
          <button className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 font-medium">수정</button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs text-gray-400">닉네임</div>
            <div className="text-sm font-medium">{nickname}</div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs text-gray-400">이메일</div>
            <div className="text-sm font-medium">{email}</div>
          </div>
          {/* 이메일은 수정 버튼 없음 */}
          <div className="w-12" />
        </div>
      </div>
      {/* 아래 여백 */}
      <div className="flex-1" />
      {/* 로그아웃/탈퇴 */}
      <div className="flex flex-col items-center gap-1 mt-10 w-full">
        <Logout/>
        <Secession/>
      </div>
    </div>
  );
}
