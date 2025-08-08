"use client";

import Face3 from "@/components/character/face3";
import ChatInputWrapper from "@/components/chat/chatinputwrapper";
import Logo from "@/components/etc/logo";
import RoleplaySlider from "@/components/main/Roleplay";
import Slider from "@/components/main/slider";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import Link from "next/link";

export default function Main() {
  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="w-screen bg-[#3B6BF0] p-6 mb-5">
        <div className="flex justify-between items-center mb-4">
          <Logo/>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-700">
              Start a conversation <br />
              with your partner
            </p>
            <Link href="/main/custom">
              <button className="mt-2 p-2 rounded-lg text-white bg-blue-600">
                Start Conversation <ChevronRightIcon className="size-6"/>
              </button>
            </Link>
          </div>

          {/* 오른쪽 캐릭터 원박스 */}
          <Face3 className="w-[150px] h-[117px]"/>
        </div>
      </div>

      <Slider />

      <RoleplaySlider />

      {/* 채팅 입력 섹션 */}
      <ChatInputWrapper />
    </div>
  );
}
