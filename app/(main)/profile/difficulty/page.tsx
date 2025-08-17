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
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <Link 
            href="/profile" 
            className="mr-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-gray-900 text-xl font-semibold font-pretendard">Difficulty</h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 relative h-full w-[375px]">
          {/* 제목 섹션 */}
          <div className="px-4 pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-pretendard leading-normal" style={{fontSize: '24px', fontWeight: 600, color: '#111827'}}>
              Select your level
            </h2>
            <p className="text-gray-400 mb-8 font-pretendard leading-[140%]" style={{fontSize: '14px', fontWeight: 500, color: '#9CA3AF'}}>
              Feedback and suggestions will <br /> match your level.
            </p>
          </div>

          {/* 레벨 선택 섹션 */}
          <div className="px-4">
            <div className="space-y-4">
              {LEVELS.map(({ value, title, description }, i) => (
                <div
                  key={value}
                  onClick={() => setSelected(value)}
                  className={`flex items-center p-4 cursor-pointer transition-all duration-200 border`}
                  style={{
                    borderRadius: selected === value ? '12px' : '16px',
                    border: selected === value ? '1px solid #316CEC' : '1px solid #E5E7EB',
                    background: selected === value ? '#EFF6FF' : '#F9FAFB'
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={images[i]}
                      alt={`level-${value}`}
                      width={48}
                      height={48}
                      className={selected === value ? '' : 'opacity-60'}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 font-pretendard">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 font-pretendard">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="px-4 py-4 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <button
            disabled={loading}
            onClick={save}
            className="w-full py-3 bg-blue-600 font-medium text-white text-lg rounded-md hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving…' : 'Save Level'}
          </button>
        </div>
      </div>
    </div>
  );
}