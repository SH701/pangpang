"use client";

import ChatInputWrapper from "@/components/chat/chatinputwrapper";
import RoleplaySlider from "@/components/main/Roleplay";
import Slider from "@/components/main/slider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Main() {
  const pathname = usePathname();
  const paddingClass = pathname === "/login" ? "pl-1.5 py-9" : "";

  return (
    <div className={`${paddingClass} mb-10 flex flex-col items-center`}>
      <div className="w-screen bg-[#F2F7FF] p-6 mb-5 ">
        <div className="flex justify-between items-center mb-4">
          <Image src="/logo3.png" alt="Logo" width={160} height={24} />
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="User Profile"
                width={16}
                height={16}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium">LV.{level}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Hello, {nickname}!</h2>
            <p className="text-sm text-gray-700">
              Start a conversation <br />with your partner
            </p>
            <Link href="/main/custom">
              <button className="mt-2 p-2 rounded-lg text-white bg-blue-600">
                Start Conversation
              </button>
            </Link>
          </div>

          {/* 오른쪽 캐릭터 원박스 */}
          <div className="w-30 h-30 rounded-full bg-[#3B6BF0] flex items-center justify-center text-white">
            Character
          </div>
        </div>
      </div>

      {/* 슬라이더 섹션 */}
      <Slider />

      <RoleplaySlider />

      {/* 채팅 입력 섹션 */}
      <ChatInputWrapper />
    </div>
  );
}
