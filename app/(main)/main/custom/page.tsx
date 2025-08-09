/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useAuth } from '@/lib/UserContext'
import Image from "next/image"
import type { Persona } from '@/lib/types'


const images = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export default function PersonaAndRoom() {
  const { accessToken } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'NONE'>('NONE')
  const [age, setAge] = useState<number | ''>('')
  const [relationship, setRelationship] = useState<'BOSS' | 'GF_PARENTS' | 'CLERK'>('BOSS')
  const [description, setDescription] = useState<
  | 'BOSS1' | 'BOSS2' | 'BOSS3'
  | 'GF_PARENTS1' | 'GF_PARENTS2' | 'GF_PARENTS3'
  | 'CLERK1' | 'CLERK2' | 'CLERK3'
>('BOSS1')
  const [profileImageUrl,setProfileImageUrl] = useState('')
   const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [status,setStatus] = useState<'ACTIVE'|"ENDED">('ACTIVE')


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1) 페르소나 생성
      const personaRes = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          gender,
          age: age === '' ? 0 : age,
          relationship,
          description,
          profileImageUrl,
          status // 이미지 직접 넣을 수 있으면 넣기
        }),
      })
      if (!personaRes.ok) throw new Error('Persona 생성 실패')
      const persona: Persona = await personaRes.json()

      // 2) 대화방 생성
      const convoRes = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personaId: persona.personaId,
          situation: description, // 상황값(예시: description)
        }),
      })
      if (!convoRes.ok) throw new Error('방 생성 실패')
      const convo = await convoRes.json()
     router.push(`/main/custom/chatroom/${convo.conversationId}`);
    } catch (e: any) {
      alert('생성 실패: ' + (e?.message ?? e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative overflow-y-scroll">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="text-xl">
          <ChevronLeftIcon className='size-6'/>
        </button>
        <h1 className="font-semibold text-black">Create</h1>
        <div className="w-6" />
      </div>
      <h2 className="text-xl font-semibold mb-4 text-center">Set up your conversation partner</h2>
        <div className="flex flex-col items-center">
  <button
    className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow-md"
    onClick={() => setAvatarModalOpen(true)}
  >
    <div className="bg-white rounded-full size-24 flex items-center justify-center overflow-hidden">
  {profileImageUrl ? (
    <Image
      src={profileImageUrl}
      width={96}
      height={96}
      alt="avatar"
      className="object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 bg-gray-100">
      +
    </div>
  )}
</div>
  </button>
</div>

{avatarModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setAvatarModalOpen(false)}
    />
    <div className="relative bg-white rounded-2xl p-6 z-10 shadow-xl flex flex-col items-center gap-4 min-w-[320px]">
      <h2 className="text-lg font-semibold mb-3">아바타를 선택하세요</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <button
            key={img}
            className={`w-20 h-20 rounded-full overflow-hidden border-4 ${profileImageUrl === img ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => {
              setProfileImageUrl(img); 
              setAvatarModalOpen(false);
            }}
          >
            <Image src={img} width={80} height={80} alt={`avatar${i + 1}`} />
          </button>
        ))}
      </div>
      <button className="mt-5 text-gray-400 text-sm underline" onClick={() => setAvatarModalOpen(false)}>
        닫기
      </button>
    </div>
  </div>
)}
      <form onSubmit={handleSubmit} className="flex-1 px-4 pt-6 *:text-[13px] *:placeholder:text-[13px]">  
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 rounded mb-4 border border-gray-300 mt-2"
          placeholder="Jisoo"
        />

        {/* Gender */}
        <label className="text-sm font-medium">Gender</label>
        <div className="flex gap-2 my-2">
          {['MALE', 'FEMALE', 'NONE'].map((value) => {
            const isSelected = gender === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value as 'MALE' | 'FEMALE' | 'NONE')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${isSelected ? 'bg-blue-300 border-2 text-black border-blue-200' : ''}`}
              >
                {value[0] + value.slice(1).toLowerCase()}
              </button>
            )
          })}
        </div>

        {/* Age */}
        <label className="text-sm font-medium">Age</label>
        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full px-3 py-2 rounded mb-4 border border-gray-300 mt-2"
          placeholder='0'
        />

        {/* Role */}
        <label className="text-sm font-medium">Role</label>
        <div className="flex gap-2 my-2">
          {[
            { value: 'BOSS', label: 'Boss' },
            { value: "GIRLFRIEND'S PARENTS", label: "Girlfriend's Parents" },
            { value: 'CLERK', label: 'Clerk' },
          ].map(({ value, label }) => {
            const isSelected = relationship === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRelationship(value as 'BOSS' | 'GF_PARENTS' | 'CLERK')}
                className={`flex-1 px-4 rounded-md border text-sm font-medium cursor-pointer ${isSelected ? 'bg-blue-400 border-2 text-black border-blue-200' : ''}`}
              >
                {label}
              </button>
            )
          })}
        </div>

       {/* Situation */}
<label className="text-sm font-medium">Situation</label>
<div className="flex flex-col gap-2 my-2">
  {[
    { value: 'BOSS1',  },
    { value: 'BOSS2',  },
    { value: 'BOSS3',  },

    { value: 'GF_PARENTS1',  },
     { value: 'GF_PARENTS2',  },
      { value: 'GF_PARENTS3',  },
    { value: 'CLERK1',  },
    { value: 'CLERK2',  },
    { value: 'CLERK3',  },
  ].map(({ value }) => {
    const isSelected = description === value
    return (
      <button
        key={value}
        type="button"
        onClick={() => setDescription(value as typeof description)}
        className={`flex-1 px-4 py-2 rounded-md border text-sm font-medium cursor-pointer ${
          isSelected ? 'bg-blue-300 border-2 text-black border-blue-200' : ''
        }`}
      >
        {value}
      </button>
    )
  })}
</div>

<button
  type="submit"
  className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded mt-7"
  disabled={loading}
>
  {loading ? "로딩중..." : "Start chatting"}
</button>
</form>
</div>
)
}
