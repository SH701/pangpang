"use client";

import Face3 from "@/components/character/face3";
import ChatInputWrapper from "@/components/chat/chatinputwrapper";
import Logo from "@/components/etc/logo";
import RoleplaySlider from "@/components/main/Roleplay";
import Slider from "@/components/main/slider";
import { useAuth } from "@/lib/UserContext";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = {
  id: number;
  email: string;
  nickname: string;
  gender: string;
  birthDate: string;
  role: string;
  provider: string;
  koreanLevel: string;
  profileImageUrl: string;
  interests: string[];
};
export default function Main() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const { accessToken }       = useAuth();
  useEffect(() => {
      if (!accessToken) {
        setError('로그인이 필요합니다');
        return;
      }
      fetch('/api/users/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
          setProfile(data);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })
    }, [accessToken]);
  
  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="w-screen bg-[#3B6BF0] p-6 mb-5 h-[calc(40vh-30px)]">
        <div className="flex justify-between items-center mb-4 mt-4">
          <Logo/>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-5">
            <p className="font-semibold text-white text-xl pt-4">Hi, {profile?.nickname}!</p>
            <p className=" text-white">
              Start a conversation <br />
              with your partner
            </p>
            <Link href="/main/custom">
             <button
      className="
        mt-2  h-10 px-2
        flex items-center justify-center gap-2 
        bg-white text-blue-600 text-sm font-medium 
        rounded-lg shadow
      "
    >
      <span>Start Conversation</span>
      <ChevronRightIcon className="w-4 h-4" />
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
