/* eslint-disable @typescript-eslint/no-explicit-any */
// app/account/manage/page.tsx
'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/UserContext'

export default function AccountManage() {
  const router = useRouter()
  const { accessToken } = useAuth()      // auth 컨텍스트에서 토큰 꺼내기
  const [userInfo, setUserInfo] = useState<{
    nickname: string
    birth: string
    email: string
  } | null>(null)

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
      .then(r => r.json())
      .then(data => {
        setUserInfo({
          nickname: data.nickname,
          birth: data.birth,
          email: data.email
        })
      })
      .catch(console.error)
  }, [accessToken])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password })
      })
      if (!res.ok) throw new Error('변경 실패')
      alert('비밀번호가 변경되었습니다.')
      router.back()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!userInfo) return <p>로딩 중…</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Account</h1>

      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm text-gray-600">Nickname</label>
          <p className="mt-1">{userInfo.nickname}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Birth</label>
          <p className="mt-1">{userInfo.birth}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600">E-mail</label>
          <p className="mt-1">{userInfo.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="password" className="block text-sm text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? '저장 중…' : '비밀번호 변경'}
        </button>
      </div>
    </div>
  )
}
