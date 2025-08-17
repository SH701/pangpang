/* eslint-disable @typescript-eslint/no-explicit-any */
// app/account/manage/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/UserContext'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

export default function AccountManage() {
  const router = useRouter()
  const { accessToken } = useAuth()
  const [userInfo, setUserInfo] = useState<{
    nickname: string
    birthDate: string
    email: string
  } | null>(null)

  const [password, setPassword] = useState('')
  const masked = '•'.repeat(password.length)
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
          birthDate: data.birthDate,
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <Link 
            href="/profile" 
            className="mr-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-gray-900 text-xl font-semibold font-pretendard">Manage Account</h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 relative h-full w-[375px]">
          {/* Edit Details 섹션 */}
          <div className="px-4 pt-6">
            <h2 className="text-gray-900 text-xl font-semibold font-pretendard leading-[130%] mb-6">
              Edit Details
            </h2>
          </div>

          {/* 사용자 정보 카드 */}
          <div className="px-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Nickname */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 text-sm font-medium font-pretendard leading-[130%]">
                    Nickname
                  </label>
                  <span className="text-gray-900 text-base font-medium font-pretendard leading-[130%]">
                    {userInfo.nickname}
                  </span>
                </div>

                {/* Birth */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 text-sm font-medium font-pretendard leading-[130%]">
                    Birth
                  </label>
                  <span className="text-gray-900 text-base font-medium font-pretendard leading-[130%]">
                    {userInfo.birthDate}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 text-sm font-medium font-pretendard leading-[130%]">
                    E-mail
                  </label>
                  <span className="text-gray-900 text-base font-medium font-pretendard leading-[130%]">
                    {userInfo.email}
                  </span>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm font-medium font-pretendard leading-[130%]">
                    Password
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-900 text-base font-medium font-pretendard leading-[130%] tracking-widest">
                      {masked}
                    </span>
                    <button className="px-4 py-2 text-blue-600 text-sm font-medium font-pretendard leading-[130%] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}