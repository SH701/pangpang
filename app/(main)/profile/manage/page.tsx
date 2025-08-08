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
    <div className="p-6 max-w-md mt-10">
      <div className="relative py-4">
  <Link href="/profile" className="absolute left-4 top-1/2 transform -translate-y-1/2">
    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
  </Link>
  <h2 className="text-lg font-semibold text-center">
    Manage Account
  </h2>
</div>
<p className='text-xl text-left font-semibold my-5'>Edit Details</p>
      <div className="space-y-3 mb-6  mt-10 bg-[#F3F4F6] rounded-xl p-8">
        <div className='flex gap-10 mb-5'>
          <label className="block text-sm text-gray-600">Nickname</label>
          <p>{userInfo.nickname}</p>
        </div>
        <div className='flex gap-10 mb-5'>
          <label className="block text-sm text-gray-600">Birth</label>
          <p >{userInfo.birthDate}</p>
        </div>
        <div className='flex gap-10 mb-5'>
          <label className="block text-sm text-gray-600">E-mail</label>
          <p >{userInfo.email}</p>
        </div>
        <div className='flex gap-10 mb-5'>
          <span className="text-sm font-medium text-gray-600">
        Password
      </span>
      <div className="flex items-center space-x-3">
        <span className="text-sm tracking-widest text-gray-800">
          {masked}
        </span>
        <button className="px-3 py-1 text-sm font-medium text-blue-500 bg-blue-100  hover:bg-blue-100 transition">
          Edit
        </button>
        </div>
      </div>
    </div>
    </div>
  )
}
