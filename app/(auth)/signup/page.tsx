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
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-4 pt-4 mt-20">
        <button onClick={() => router.back()} className="absolute text-gray-600 hover:text-gray-800">
          <ChevronLeftIcon className="w-6 h-6 mt-1.5" />
        </button>
        <h1 className="text-center text-2xl font-semibold">Create account</h1>
      </div>

      <div className="flex-1 px-4 pt-8 space-y-10 mt-10">
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl placeholder-gray-400 focus:outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label className="block font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl placeholder-gray-400 focus:outline-none"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl placeholder-gray-400 focus:outline-none"
            value={pw2}
            onChange={e => setPw2(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            8–16 characters, include letters & numbers
          </p>
        </div>

        <label className="flex items-start space-x-2 mt-10">
          <input
            type="checkbox"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Agree with{' '}
            <a href="#" className="underline">Terms of use</a> and our{' '}
            <a href="#" className="underline">privacy policy</a>
          </span>
        </label>
      </div>

      <footer className={`p-4 ${canNext ? 'bg-blue-600' : 'bg-[#BFDBFE]'}`}>
        <button
          disabled={!canNext}
          onClick={goNext}
          className={`w-full py-3  font-semibold transition text-lg ${
            canNext ? 'text-white' : ' text-gray-100 cursor-not-allowed' 
          }`}
        >
          Next
        </button>
      </footer>
    </div>
  );
}
