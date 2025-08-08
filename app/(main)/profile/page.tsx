'use client';

import Face3 from '@/components/character/face3';
import { logout } from '@/lib/logout';
import { useAuth } from '@/lib/UserContext';
import {
  ChevronRightIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { accessToken }       = useAuth();


  const [count, setCount]     = useState(45);
  const [level, setLevel]     = useState(45);

  useEffect(() => {
    if (!accessToken) {
      setError('로그인이 필요합니다');
      setLoading(false);
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
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading)       return <p className="text-center mt-10">Loading…</p>;
  if (error)         return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!profile)      return <p className="text-center mt-10">No profile data</p>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 mt-20">
      {/* 아바타 + 닉네임 */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {profile.profileImageUrl.startsWith('http') ? (
            <Image
              src={profile.profileImageUrl}
              alt="프로필"
              width={120}
              height={120}
              className="rounded-full bg-blue-50"
            />
          ) : (
            <Face3 className="w-32 h-32 rounded-full bg-blue-50 p-4" />
          )}

        </div>
        <Link
          href="/profile/edit"
          className="mt-4 inline-flex items-center space-x-1 text-lg font-semibold"
        >
          <span className='pl-8'>{profile.nickname}</span>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="bg-[#316CEC] rounded-xl p-4 flex justify-around text-white">
        <div className="flex flex-col items-center">
          <span className="text-sm">Studied Sentence</span>
          <span className="text-2xl font-bold">{count}</span>
        </div>
        <div className="w-px bg-white opacity-50" />
        <div className="flex flex-col items-center">
          <span className="text-sm">K-Level</span>
          <span className="text-2xl font-bold">{level}</span>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="space-y-4">
        {[
          { href: '/profile/manage', icon: <UserIcon className="w-6 h-6 text-gray-600" />, label: 'Manage Account' },
          { href: '/profile/difficulty', icon: <ChartBarIcon className="w-6 h-6 text-gray-600" />, label: 'Difficulty' },
          { href: '/terms', icon: <DocumentTextIcon className="w-6 h-6 text-gray-600" />, label: 'Terms of Service / Licenses' },
        ].map(({ href, icon, label }) => (
          <Link key={label} href={href} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {icon}
              </div>
              <span className="text-base">{label}</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* 로그아웃 */}
      <button
        onClick={logout}
        className="block mx-auto text-sm text-gray-400 underline"
      >
        Log out
      </button>
    </div>
  );
}
