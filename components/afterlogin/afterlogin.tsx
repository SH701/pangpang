'use client';

import { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/lib/UserContext';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
type Level = typeof LEVELS[number];

const INTERESTS = ['DAILY_CONVERSATION','TRAVEL','KDRAMA','BUSINESS'] as const;
type Interest = typeof INTERESTS[number];

export default function AfterLogin() {
  const router = useRouter();
  const { user, setUser } = useAuth();  
  const initialLevel = LEVELS.includes(user?.koreanLevel as Level)
  ? (user!.koreanLevel as Level)
  : LEVELS[0];
  const sliderRef = useRef<Slider>(null);

  const [level, setLevel] = useState<Level>(initialLevel);
  const [interests, setInterests] = useState<Interest[]>(user?.interests as Interest[] ?? []);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(user?.profileImageUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // user 가 아직 없으면 로그인 페이지로
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const next = () => sliderRef.current?.slickNext();
  const prev = () => sliderRef.current?.slickPrev();

  const toggleInterest = (i: Interest) => {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        koreanLevel: level,
        interests,
        profileImageUrl,
      };

      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data: { user?: User; message?: string } = await res.json();

      if (!res.ok || !data.user) {
        setError(data.message || '프로필 업데이트에 실패했습니다.');
      } else {
        // Context 에 업데이트된 user 저장
        setUser(data.user);
        router.push('/app');
      }
    } catch (err) {
      console.error(err);
      setError('알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // 로그인 전에는 아무것도 렌더링하지 않음

  return (
    <div className="max-w-md mx-auto p-4">
      <Slider
        ref={sliderRef}
        dots
        infinite={false}
        speed={300}
        slidesToShow={1}
        arrows={false}
      >
        {/* 1. Level 선택 */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Select Korean Level</h2>
          <input
            type="range"
            min={0}
            max={LEVELS.length - 1}
            step={1}
            value={LEVELS.indexOf(level)}
            onChange={e => setLevel(LEVELS[+e.target.value])}
            className="w-full"
          />
          <div className="flex justify-between w-full text-sm text-gray-600 mt-2">
            {LEVELS.map(l => <span key={l}>{l}</span>)}
          </div>
          <button onClick={next} className="mt-6 py-2 px-8 bg-blue-600 text-white rounded">
            Next
          </button>
        </div>

        {/* 2. 프로필 사진 URL 입력 */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Profile Image URL</h2>
          <input
            type="text"
            placeholder="https://..."
            value={profileImageUrl}
            onChange={e => setProfileImageUrl(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl placeholder-gray-400 focus:outline-none"
          />
          <div className="mt-6 flex gap-4">
            <button onClick={prev} className="py-2 px-4 bg-gray-300 rounded">Back</button>
            <button onClick={next} className="py-2 px-4 bg-blue-600 text-white rounded">Next</button>
          </div>
        </div>

        {/* 3. 관심사 선택 */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Select Interests</h2>
          <div className="grid grid-cols-2 gap-4">
            {INTERESTS.map(i => (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={`px-4 py-2 border rounded ${
                  interests.includes(i) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {i.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <button onClick={prev} className="py-2 px-4 bg-gray-300 rounded">Back</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="py-2 px-4 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Finish'}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </div>
      </Slider>
    </div>
  );
}
