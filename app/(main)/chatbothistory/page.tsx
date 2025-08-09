/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/UserContext'
import { motion } from 'framer-motion'
import { Conversation } from '@/lib/types'



type SliderItem =
  | { isAdd: true }
  | { isAdd: false; personaId: number; name: string; profileImageUrl: string }

export default function ChatHistory() {
  const { accessToken } = useAuth()
  const [history, setHistory] = useState<Conversation[]>([])
  const [allHistory, setAllHistory] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<'done' | 'in-progress'>('done')
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  // 필터값 -> status 파라미터 변환
  const filterMap: Record<typeof selectedFilter, string> = {
    done: 'ENDED',
    'in-progress': 'ACTIVE',
  }

useEffect(() => {
  if (!accessToken) return;

  Promise.all([
    fetch(`/api/conversations?status=ENDED&page=1&size=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(res => res.json()).then(data => data.content ?? []),

    fetch(`/api/conversations?status=ACTIVE&page=1&size=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(res => res.json()).then(data => data.content ?? []),
  ])
    .then(([ended, active]) => {
      setAllHistory([...ended, ...active]);
    })
    .catch(() => setAllHistory([]));
}, [accessToken]);

  // *** [2] 리스트용 필터링 데이터 ***
  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    fetch(`/api/personas/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        setHistory(data.content ?? [])
        setLoading(false)
      })
      .catch(err => {
        setError('불러오기 실패')
        setLoading(false)
      })
  }, [accessToken, selectedFilter])

  // **슬라이더용 데이터 만들기 (전체 인물)**
  const sliderList: SliderItem[] = [
    { isAdd: true },
    ...(allHistory ?? []).map((c: { aiPersona: { personaId: any; name: any; profileImageUrl: any } }) => ({
      isAdd: false,
      personaId: c.aiPersona.personaId,
      name: c.aiPersona.name,
      profileImageUrl: c.aiPersona.profileImageUrl,
    })),
  ]

  // **슬라이더 개수, 드래그 한계 계산**
  const visibleCount = 3
  const itemWidth = 56 
  const dragLimit = -((sliderList.length - visibleCount) * itemWidth + itemWidth / 2)

  return (
    <div className="bg-white w-full p-6 flex flex-col">
      <span className="text-left font-semibold text-xl my-10">Chat History</span>
      <div ref={containerRef} className="overflow-hidden w-[330px]">
        <motion.div
          className="flex space-x-3 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: dragLimit, right: 0 }}
          transition={{ type: 'spring', bounce: 0.2 }}
        >
          {sliderList.map((c, i) =>
  c.isAdd ? (
    <button
      key={'add'}
      onClick={() => setOpen(true)}
      className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl shrink-0"
    >
      +
    </button>
  ) : (
    <div key={c.personaId} className="flex flex-col items-center shrink-0 w-14">
      {c.profileImageUrl ? (
        <Image
          src={c.profileImageUrl}
          alt={c.name}
          width={56}
          height={56}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl">
          {c.name.charAt(0)}
        </div>
      )}
      <span className="text-xs text-center truncate">{c.name}</span>
    </div>
  )
)}
        </motion.div>
      </div>
       <div className=" mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
           <button
  onClick={() => setSelectedFilter('done')}
  className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
    selectedFilter === 'done'
      ? 'border-blue-500 text-blue-500 bg-white'
      : 'border-gray-300 text-gray-500 bg-white'
  }`}
>
  Done
</button>
<button
  onClick={() => setSelectedFilter('in-progress')}
  className={`px-4 py-1 rounded-full border text-xs font-medium transition-colors ${
    selectedFilter === 'in-progress'
      ? 'border-blue-500 text-blue-500 bg-white'
      : 'border-gray-300 text-gray-500 bg-white'
  }`}
>
  In progress
</button>
          </div>
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {history.length === 0 && !loading && (
            <p className="text-gray-400 text-center mt-10">No chat history.</p>
          )}
          {history.map(chat => (
            <div
              key={chat.conversationId}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                {chat.aiPersona.profileImageUrl && chat.aiPersona.profileImageUrl.startsWith('http') ? (
                  <Image
                    src={chat.aiPersona.profileImageUrl}
                    width={48}
                    height={48}
                    alt={chat.aiPersona.name}
                    className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-gray-600 font-semibold text-sm">
                      {chat.aiPersona.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex-1 min-w-0">
  <h3 className="font-bold text-black text-base">{chat.aiPersona.name}</h3>
  <p className="text-sm text-black truncate">{chat.aiPersona.description}</p>
</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
