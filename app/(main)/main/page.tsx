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
    <div className="min-h-screen bg-blue-50 flex flex-col max-w-[375px] mx-auto">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        
        {/* 환영 섹션 */}
        <div className="w-full px-4 py-8 text-white bg-[#3B6BF0]">
          <Logo/>
          <div className="flex justify-between items-start pt-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-16">
                <div className="flex flex-col gap-4">
              <h1 className="font-bold text-white text-2xl leading-[130%]">
                Hi, {profile?.nickname || 'Noonchi'}!
              </h1>
              <p className="text-white text-base leading-[130%]">
                Start a conversation <br />
                with your partner
              </p>   
              </div>            
              <Face3 className="w-[120px] h-[100px]"/>
              </div>
              <Link href="/main/custom">
                <button className="
                  mt-2 h-10 px-5 w-[334px]
                  flex items-center justify-center gap-2 
                  bg-white text-blue-500 text-sm font-semibold 
                  rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200
                ">
                  <span>Start Conversation</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* 오른쪽 캐릭터 */}
           
          </div>
        </div>

        {/* 슬라이더 섹션 */}
        <div className="px-4 py-2">
          <Slider />
        </div>
        
        {/* 채팅 입력 섹션 */}
        <div className=" px-4 pb-20">
          <ChatInputWrapper />
        </div>
      </div>
    </div>
  );
}