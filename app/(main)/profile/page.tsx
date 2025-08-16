'use client';

import Face0 from '@/components/character/face0';
import Face1 from '@/components/character/face1';
import Face2 from '@/components/character/face2';
import Face3 from '@/components/character/face3';
import { useAuth } from '@/lib/UserContext';
import {
  ChevronRightIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Profile = {
  id: number;
  email: string;
  nickname: string;
  gender: string;
  birthDate: string;
  role: string;
  provider: string;
  klevel: number;
  sentenceCount:number;
  profileImageUrl: string;
  interests: string[];
};
const FACES = [
  { Component: Face0, id: 'face0' },
  { Component: Face1, id: 'face1' },
  { Component: Face2, id: 'face2' },
  { Component: Face3, id: 'face3' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { accessToken }       = useAuth();

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

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login'); 
  };

  if (loading)       return <p className="text-center mt-10">Loading…</p>;
  if (error)         return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!profile)      return <p className="text-center mt-10">No profile data</p>;

  return (
    <>
    <div className="max-w-md mx-auto p-4 space-y-6 mt-20">
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
           (() => {
      const Face =
        FACES.find(f => f.id === profile.profileImageUrl)?.Component || Face3;
      return (
        <Face className="w-32 h-32 rounded-full bg-blue-50 p-4" />
      );
    })()
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
      <div className="border border-blue-200 bg-[#EFF6FF] rounded-xl p-4 flex justify-around text-blue-600">
        <div className="flex flex-col items-center w-[50%]">
          <span className="text-sm">Studied Sentence</span>
          <span className="text-2xl font-bold text-black">{profile.sentenceCount}</span>
        </div>
        <div className="w-px bg-blue-200" />
        <div className="flex flex-col items-center w-[50%]">
          <span className="text-sm">K-Level</span>
          <span className="text-2xl font-bold text-black">{profile.klevel}</span>
        </div>
      </div>
    </div>
     <div className='w-full bg-gray-100 h-4'></div>
     <div className="bg-white rounded-xl divide-y divide-gray-200 overflow-hidden w-full mt-10">
        {[
          { href: '/profile/manage', icon: <UserIcon className="w-6 h-6 text-gray-600" />, label: 'Manage Account' },
          { href: '/profile/difficulty', icon: <ChartBarIcon className="w-6 h-6 text-gray-600" />, label: 'Difficulty' },
          { href: '/terms', icon: <DocumentTextIcon className="w-6 h-6 text-gray-600" />, label: 'Terms of Service / Licenses' },
        ].map(({ href, icon, label }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 mt-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {icon}
              </div>
              <span className="text-base text-gray-800">{label}</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>
        <div className="h-[140px]" />
       <button
        onClick={handleLogout}
        className="fixed left-1/2 -translate-x-1/2 bottom-[100px] z-50 text-sm text-gray-600 underline"
      >
        Log out
      </button>
      </>
  );
}