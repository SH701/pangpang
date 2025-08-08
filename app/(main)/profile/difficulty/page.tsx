'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/UserContext';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Image from 'next/image'

const LEVELS = [
  {
    value: 'BEGINNER',
    title: 'Beginner',
    description:
      "I know basic polite words, but I'm not sure when or how to use honorifics.",
  },
  {
    value: 'INTERMEDIATE',
    title: 'Intermediate',
    description:
      "I can use endings, but I'm not confident in using formal or respectful language correctly.",
  },
  {
    value: 'ADVANCED',
    title: 'Advanced',
    description:
      "I understand and use honorifics naturally depending on context or relationship.",
  },
] as const;

type Level = (typeof LEVELS)[number]['value'];
const images=[
  "/circle/circle1.png",
  "/circle/circle2.png",
  "/circle/circle3.png",
]
export default function LevelSelectPage() {
  const router = useRouter();
  const { accessToken, koreanLevel, setKoreanLevel } = useAuth();
  const [selected, setSelected] = useState<Level>(koreanLevel);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (selected === koreanLevel) {
      router.back();
      return;
    }
    setLoading(true);
    const res = await fetch('/api/users/me/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ koreanLevel: selected }),
    });
    if (res.ok) {
      setKoreanLevel(selected);
      router.back();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Level update failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 mt-10">
      <div className="relative py-4">
  <Link href="/profile" className="absolute left-4 top-1/2 transform -translate-y-1/2">
    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
  </Link>
  <h2 className="text-lg font-semibold text-center">
    Difficulty
  </h2>
</div>
<div className='flex flex-col gap-2'>
      <h1 className="text-xl font-bold">Select your level</h1>
      <p className="text-sm text-gray-500">
        Feedback and suggestions will <br /> match your level.
      </p>
      </div>

      <div className="space-y-4">
  {LEVELS.map(({ value, title, description }, i) => (
    <button
      key={value}
      onClick={() => setSelected(value)}
      className={`w-full flex items-center justify-center space-x-4 p-4 border rounded-lg transition ${
        selected === value
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      {/* 동그라미 이미지 */}
      <Image
        src={images[i]}
        width={48}
        height={48}
        alt={`level-${value}`}
        className={`rounded-full flex-shrink-0 border-2 ${
          selected === value ? 'border-blue-600' : 'border-gray-400'
        }`}
      />
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  ))}
</div>

      <button
        disabled={loading}
        onClick={save}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Save Level'}
      </button>
    </div>
  );
}
