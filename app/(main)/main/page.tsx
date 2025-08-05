"use client";

import ChatInputWrapper from "@/components/chat/chatinputwrapper";
import RoleplaySlider from "@/components/main/Roleplay";
import Slider from "@/components/main/slider";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Main() {
  const { user } = useUser();
  const nickname = user?.unsafeMetadata?.nickname  as string 
  const level = user?.unsafeMetadata?.level as string             
  const pathname = usePathname();
  const paddingClass = pathname === "/login" ? "pl-1.5 py-9" : "";

  return (
    <div className={`${paddingClass} mb-10 flex flex-col items-center`}>
      <div className="w-screen bg-gray-200 p-6 mb-5 ">
        <div className="flex justify-between items-center mb-4">
          <Image src="/logo.svg" alt="Logo" width={24} height={24} />
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
            <Link href="/main/chats">
              <button className="mt-2 px-4 py-2 bg-black text-white rounded-2xl">
                Start Conversation
              </button>
            </Link>
          </div>

          {/* 오른쪽 캐릭터 원박스 */}
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
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
