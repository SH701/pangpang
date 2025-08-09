/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignupStep2() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const password = params.get('password') || '';

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [, setError] = useState<string | null>(null);

  const canSubmit = name.trim() !== '' && birthDate !== '';

  const handleSignup = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nickname: name,
          gender,
          birthDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed');
        return;
      }
      setTimeout(() => {
      router.push('/after');
    }, 3000);
    } catch (e) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* header */}
      <div className="px-4 pt-4 mt-20">
        <button onClick={() => router.back()} className="absolute text-gray-600 hover:text-gray-800 ">
          <ChevronLeftIcon className="w-6 h-6 mt-1" />
        </button>
        <h1 className="text-center text-[22px] font-semibold">Enter your details</h1>
        <p className="text-center text-gray-500 text-sm mt-1">
          Enter it exactly as shown on your ID
        </p>
      </div>

      {/* form */}
      <div className="flex-1 px-4 pt-8 space-y-10">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl placeholder-gray-400 focus:outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block font-medium mb-1">Birth date</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl placeholder-gray-400 focus:outline-none"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
          />
        </div>

        {/* Gender toggle */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex space-x-4">
            {(['MALE','FEMALE'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-xl border font-medium ${
                  gender === g
                    ? 'bg-blue-50 text-blue-500  border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {g === 'MALE' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="p-4 bg-blue-600">
        <button
          disabled={!canSubmit}
          onClick={handleSignup}
          className={`w-full py-3  font-semibold transition text-lg ${
            canSubmit ? 'text-white' : ' text-gray-300 cursor-not-allowed' 
          }`}
        >
          Next
        </button>
      </footer>
    </div>
  );
}
