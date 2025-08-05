"use client";

import ChatInputWrapper from "@/components/chat/chatinputwrapper";
import RoleplaySlider from "@/components/main/Roleplay";
import Slider from "@/components/main/slider";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RotatingTalk from "@/components/ratatingtalk";


export default function Main() {
  const { user } = useUser();
  const pathname = usePathname();
  const paddingClass = pathname === "/login" ? "pl-1.5  py-9" : "";

  return (
    <div className={`${paddingClass} mb-10`}>
      {/* 유저 프로필 & 인사말 */}
      <div className="flex items-center gap-1 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-500" />
         <RotatingTalk/>
      </div>

      {/* 캐릭터 박스 */}
      <div className="bg-gray-400 rounded-2xl p-6 flex flex-col items-center gap-2 w-[335px] h-50 mb-5 shadow-lg">
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt="User"
            width={96}
            height={96}
            className="rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center"></div>
        )}
        <span className="text-base font-semibold">
            {user?.unsafeMetadata?.nickname ? `Hello, ${user.unsafeMetadata.nickname}!` : "Guest"}
        </span>
        <button className="w-50 h-10 rounded-2xl bg-black">
          <Link href="main/chats" className="text-white text-lg">Start Conversation</Link>
        </button>
      </div>

      {/* 존댓말 박스 */}
      <Slider />

      {/* 추천 상황 */}
      <RoleplaySlider />

      {/* 하단 채팅 */}
      <ChatInputWrapper />
    </div>
  );
}
