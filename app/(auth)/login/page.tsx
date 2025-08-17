/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/UserContext';
import Loading from '@/app/after/loading';
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      setAccessToken(data.accessToken);

      const meRes = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const me = await meRes.json();

      if (me.koreanLevel === null || me.koreanLevel === 'null'||me.koreanLevel === undefined) {
        router.replace('/after');
      } else {
        setLoading(true); 
        setTimeout(() => {
          router.replace('/main');
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong');
    }
  };

  
  if (loading) {
    return <Loading/>
  }

  return (
    <div className="min-h-screen flex flex-col bg-white px-4">
      {/* 상단 로고 */}
      <div className="flex justify-center items-center" style={{ marginTop: '128px' }}>
        <Image 
          src="/etc/logo_login.svg" 
          alt="Logo" 
         width={200}
         height={42}
        />
      </div>
      
      {/* 로그인 폼 */}
      <div className="flex-1 flex items-start justify-center" style={{ marginTop: '42px' }}>
        <div className="w-full max-w-sm space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-gray-900 transition"
          >
            Sign in
          </button>

          <p className="text-center text-sm text-gray-500">
            First time here?{' '}
            <Link href="/signup" className="font-medium text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}