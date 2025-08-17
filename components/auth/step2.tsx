'use client';
export const dynamic = 'force-dynamic';

import Loading from '@/app/after/loading';
import { useAuth } from '@/lib/Token';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function SignupStep2() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim() !== '' && birthDate !== '';

  useEffect(() => {
    setEmail(params.get('email') || '');
    setPassword(params.get('password') || '');
  }, [params]);

  const parseJsonSafe = async (res: Response) => {
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : {};
  };

  const handleSignup = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname: name, gender, birthDate }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) {
        setError(data?.message || 'Signup failed');
        return;
      }

      const token = data?.accessToken;
      if (!token) {
        setError('토큰이 없습니다. 관리자에게 문의하세요.');
        return;
      }

      setAccessToken(token);
      localStorage.setItem('accessToken', token);

      // ✅ 로딩 표시 후 1.5초 뒤 이동
      setLoading(true);
      setTimeout(() => {
        router.push('/after');
      }, 1500);
    } catch {
      setError('Something went wrong');
    }
  };

  // ✅ 로딩 중일 때 화면
  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[375px] mx-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-white mt-8">
        <h2 className="text-xl font-semibold font-pretendard text-gray-800 text-left">
          Enter your details
        </h2>
        <p className="text-sm font-normal font-pretendard text-gray-500 text-left mt-2 leading-[140%]">
          Enter it exactly as shown on your ID
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium font-pretendard text-gray-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium font-pretendard text-gray-700 mb-2">Birth date</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        {/* Gender toggle */}
        <div>
          <label className="block text-sm font-medium font-pretendard text-gray-700 mb-2">Gender</label>
          <div className="flex space-x-4">
            {(['MALE', 'FEMALE'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-xl border font-medium transition-colors ${
                  gender === g
                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                {g === 'MALE' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>
      </div>
{/* Footer Button */}
<div className="fixed bottom-0 left-0 right-0 bg-white">
  <button
    disabled={!canSubmit}
    onClick={handleSignup}
    className={`w-full h-[92px] py-4 font-semibold text-lg rounded-none font-pretendard ${
      canSubmit
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-[#BFDBFE] text-[#EFF6FF] cursor-not-allowed'
    }`}
    style={{
      paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)", // iOS 홈바 피하기
    }}
  >
    Next
  </button>
</div>
    </div>
  );
}