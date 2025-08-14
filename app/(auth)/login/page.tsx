'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/UserContext';
import WhiteLogo from '@/components/etc/whitelogo';

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
  
      // 토큰이 정상적으로 응답으로 오면
      const token = data.accessToken;
      if (!token) {
        setError('No access token received');
        return;
      }
  
      setAccessToken(token);
  
      // localStorage에 토큰 저장
      localStorage.setItem('accessToken', token);
  
      // 쿠키에 토큰 저장
      document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  
      // 로그인 후 페이지로 이동
      router.push('/after');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong');
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center items-center" >
         <WhiteLogo/>
        </div>
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
  );
}
