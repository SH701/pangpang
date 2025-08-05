"use client";

import RoleplaySlider from "@/components/main/Roleplay";
import Slider from "@/components/main/slider";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Main() {
  const { user } = useUser();
  const pathname = usePathname();
  const paddingClass = pathname === "/login" ? "pl-1.5  py-9" : "p-4";

  return (
    <div className={`${paddingClass} mb-10`}>
      {/* 유저 프로필 & 인사말 */}
      <div className="flex items-center gap-1 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-500" />
        <span className="text-base">
          {user?.username ? `Hello ${user.username}!` : "Please login"}
        </span>
      </div>

      {/* 캐릭터 박스 */}
      <div className="bg-gray-400 rounded-2xl p-6 flex flex-col items-center gap-6 w-[335px] h-60 mb-5 shadow-lg">
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt="User"
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-lg">Character</span>
          </div>
        )}
        <button className="w-50 h-10 rounded-2xl bg-black">
          <span className="text-white text-lg">Start Conversation</span>
        </button>
      </div>

      {/* 존댓말 박스 */}
      <Slider />

      {/* 추천 상황 */}
      <RoleplaySlider />
    </div>
  );
}
