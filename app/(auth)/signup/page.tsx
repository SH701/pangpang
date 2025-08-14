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
    <div className="min-h-screen bg-white px-4 pt-13">
      <div className="w-full max-w-sm mx-auto flex flex-col h-full space-y-6">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-center text-2xl font-semibold flex-1">Create account</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={pw}
              onChange={e => setPw(e.target.value)}
            />
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={pw2}
              onChange={e => setPw2(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              8–16 characters, include letters & numbers
            </p>
          </div>

          <label className="flex items-start space-x-2">
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

        <div className="mt-auto pt-8">
          <button
            disabled={!canNext}
            onClick={goNext}
            className={`w-full py-3 font-medium rounded-md transition ${
              canNext 
                ? 'bg-blue-600 text-white hover:bg-gray-900' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
