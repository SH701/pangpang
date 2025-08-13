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
    <div className=" bg-[#F2F7FF] flex flex-col overflow-y-scroll">
        <div className="w-full px-6 py-6 text-white bg-[#3B6BF0]">
          <Logo/>
        <div className="flex justify-between items-start mb-4 pt-2">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-white text-3xl leading-tight">
              Hi, {profile?.nickname || 'Noonchi'}!
            </h1>
            <p className="text-white text-lg leading-relaxed">
              Start a conversation <br />
              with your partner
            </p>
            <Link href="/main/custom">
              <button className="
                mt-4 h-14 px-8
                flex items-center justify-center gap-3 
                bg-white text-blue-500 text-base font-semibold 
                rounded-xl shadow-lg hover:bg-gray-50 transition-colors duration-200
              ">
                <span>Start Conversation</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* 오른쪽 캐릭터 */}
          <div className="flex-shrink-0">
            <Face3 className="w-[140px] h-[110px]"/>
          </div>
        </div>
      </div>

       <div className="px-6 mb-8">
        <Slider />
      </div>

      <div className="px-6 mb-4">
        <RoleplaySlider />
      </div>
      {/* 채팅 입력 섹션 */}
        <ChatInputWrapper />
    </div>
  );
}
