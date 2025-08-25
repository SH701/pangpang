"use client";

import Logo from "@/components/etc/logo";
import Image from "next/image";
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
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  useEffect(() => {
    if (!accessToken) {
      setError("로그인이 필요합니다");
      return;
    }
    fetch("/api/users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
      });
  }, [accessToken]);

  return (
    <div
      className="min-h-screen bg-blue-50 flex flex-col w-full overflow-x-hidden overflow-y-auto"
      style={{ paddingBottom: "calc(153px + env(safe-area-inset-bottom))" }}
    >
      {/* 메인 콘텐츠 */}
      <div className="flex flex-col ">
        {/* 환영 섹션 */}
        <div className="w-full px-7 py-6 text-white bg-[#3B6BF0] ">
          <Logo className="w-28 h-6" />
          <div className="flex justify-between items-start pt-2">
            <div className="flex flex-col gap-2">
              <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="font-bold text-white text-2xl leading-[130%] pt-3">
                    Hi, {profile?.nickname || "Noonchi"}!
                  </h1>
                  <p className="text-white  leading-[130%]">
                    Start a conversation <br />
                    with your partner
                  </p>
                </div>
                <Image
                  src="/characters/main.svg"
                  alt="main char"
                  width={135}
                  height={109}
                />
              </div>
              <Link href="/main/custom">
                <button
                  className="
                  mt-1 h-13 px-5 w-full
                  flex items-center justify-center gap-2 
                  bg-white text-blue-500 text-sm font-semibold 
                  rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200
                "
                >
                  <span className="font-semibold">Start Conversation</span>
                  <ChevronRightIcon className="w-4 h-4 font-semibold" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 슬라이더 섹션 */}
        <div className="px-4">
          <Slider />
        </div>
      </div>
    </div>
  );
}
