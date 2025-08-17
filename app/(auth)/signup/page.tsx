'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function SignupStep1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState(false);

  const canNext =
    email.includes('@') &&
    pw.length >= 8 &&
    pw === pw2 &&
    agree;
  const goNext = () => {
    if (!canNext) return;
    router.push(
      `/signup/detail?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pw)}`
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[375px] mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-center text-xl font-semibold font-pretendard text-gray-800 mt-2">Create account</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 space-y-8">
        <div>
          <label className="block text-sm font-medium font-pretendard text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium font-pretendard text-gray-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={pw2}
            onChange={e => setPw2(e.target.value)}
          />
          <p className="text-xs text-gray-500 font-pretendard">
            8–16 characters, include letters & numbers
          </p>
        </div>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 font-pretendard leading-relaxed">
            Agree with{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">Terms of use</a> and our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">privacy policy</a>
          </span>
        </label>
      </div>

      {/* Footer Button */}
      <div className="px-6 py-6 border-t border-gray-200 bg-white">
        <button
          disabled={!canNext}
          onClick={goNext}
          className={`w-full py-4 font-semibold text-lg rounded-xl transition-all duration-200 font-pretendard ${
            canNext 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
