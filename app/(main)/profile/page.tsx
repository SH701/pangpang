"use client";

import Face0 from "@/components/character/face0";
import Face1 from "@/components/character/face1";
import Face2 from "@/components/character/face2";
import Face3 from "@/components/character/face3";
import { useAuth } from "@/lib/UserContext";
import {
  ChevronRightIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Profile = {
  id: number;
  email: string;
  nickname: string;
  gender: string;
  birthDate: string;
  role: string;
  provider: string;
  klevel: number;
  sentenceCount: number;
  profileImageUrl: string;
  interests: string[];
};
const FACES = [
  { Component: Face0, id: "face0" },
  { Component: Face1, id: "face1" },
  { Component: Face2, id: "face2" },
  { Component: Face3, id: "face3" },
];

function normalizeSrc(src?: string) {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("/")) return src; // URL or public 경로
  return null; // face0, face1 같은 경우는 null 반환 → 별도 처리
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      setError("로그인이 필요합니다");
      setLoading(false);
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
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (error)
    return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!profile) return <p className="text-center mt-10">No profile data</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900 text-xl font-semibold font-pretendard">
            Profile
          </h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 relative h-full w-[375px]">
          {/* 프로필 섹션 */}
          <div className="px-4 pt-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {(() => {
                  const imgSrc = normalizeSrc(profile.profileImageUrl);

                  if (imgSrc) {
                    return (
                      <Image
                        src={imgSrc}
                        alt="프로필"
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                      />
                    );
                  }

                  const Face = FACES.find(
                    (f) => f.id === profile.profileImageUrl
                  )?.Component;
                  if (Face) {
                    return <Face className="w-[120px] h-[120px]" />;
                  }

                  return (
                    <div className="w-[120px] h-[120px] bg-gray-200 rounded-full" />
                  );
                })()}
              </div>

              <Link
                href="/profile/edit"
                className="inline-flex items-center space-x-2 text-gray-900 text-xl font-semibold font-pretendard leading-[130%] hover:text-gray-700 transition-colors ml-5"
              >
                <span>{profile.nickname}</span>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="px-4 pt-6">
            <div className="bg-[#EFF6FF] rounded-2xl border border-blue-200 p-6">
              <div className="flex justify-around">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-blue-600 text-sm font-medium font-pretendard leading-[130%] mb-2">
                    Studied Sentence
                  </span>
                  <span className="text-gray-900 text-2xl font-bold font-pretendard leading-[130%]">
                    {profile.sentenceCount}
                  </span>
                </div>
                <div className="w-px bg-blue-200 mx-4" />
                <div className="flex flex-col items-center flex-1">
                  <span className="text-blue-600 text-sm font-medium font-pretendard leading-[130%] mb-2">
                    K-Level
                  </span>
                  <span className="text-gray-900 text-2xl font-bold font-pretendard leading-[130%]">
                    {profile.klevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 메뉴 섹션 */}
          <div className="px-4 pt-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {[
                {
                  href: "/profile/manage",
                  icon: <UserIcon className="w-6 h-6 text-gray-600" />,
                  label: "Manage Account",
                },
                {
                  href: "/profile/difficulty",
                  icon: <ChartBarIcon className="w-6 h-6 text-gray-600" />,
                  label: "Difficulty",
                },
                {
                  href: "/terms",
                  icon: <DocumentTextIcon className="w-6 h-6 text-gray-600" />,
                  label: "Terms of Service / Licenses",
                },
              ].map(({ href, icon, label }, index) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors ${
                    index !== 2 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {icon}
                    </div>
                    <span className="text-gray-900 text-base font-medium font-pretendard leading-[130%]">
                      {label}
                    </span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <div className="px-4 pt-6 pb-6">
            <button
              onClick={handleLogout}
              className="w-full py-4 text-gray-600 text-base font-medium font-pretendard leading-[130%] underline hover:text-gray-800 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
