'use client';
export const dynamic = 'force-dynamic'; // ✅ 빌드 시 프리렌더 방지

import { useAuth } from '@/lib/Token';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
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

  const canSubmit = name.trim() !== '' && birthDate !== '';

  useEffect(() => {
    setEmail(params.get('email') || '');
    setPassword(params.get('password') || '');
  }, [params]);
const parseJsonSafe = async (res: Response) => {
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : {}
}
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
      setError('토큰이 없습니다. 관리자에게 문의하세요.'); // ❗ 계약 보장 필요
      return;
    }

    setAccessToken(token);                 // 메모리/컨텍스트
    localStorage.setItem('accessToken', token); // 지속성 원하면 (보안 고려)
    router.push('/after');
  } catch {
    setError('Something went wrong');
  }
};

  return (
    <div className="min-h-screen bg-white px-4 pt-13">
      <div className="w-full max-w-sm mx-auto flex flex-col h-full space-y-6">

        
        <div className="w-[274px] h-[62px] flex flex-col items-start justify-center">
          <h2 className="font-pretendard text-2xl font-semibold leading-[130%] text-gray-900">
            Enter your details
          </h2>
          <p className="font-pretendard text-sm font-normal leading-[140%] text-gray-400 mt-1">
            Enter it exactly as shown on your ID
          </p>
        </div>

        {/* form */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth date</label>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
            />
          </div>

          {/* Gender toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex space-x-4">
              {(['MALE', 'FEMALE'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-3 rounded-md border font-medium ${
                    gender === g
                      ? 'bg-blue-50 text-blue-500 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {g === 'MALE' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button
            disabled={!canSubmit}
            onClick={handleSignup}
            className={`w-full py-3 font-medium rounded-md transition ${
              canSubmit 
                ? 'bg-blue-600 text-white hover:bg-gray-900' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}