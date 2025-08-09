/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/UserContext'
import { Conversation } from '@/lib/types'



export default function ChatHistory() {
  const { accessToken } = useAuth()
  const [history, setHistory] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<'done' | 'in-progress'>('done')

  // 필터값 -> status 파라미터 변환
  const filterMap: Record<typeof selectedFilter, string> = {
    done: 'ENDED',
    'in-progress': 'ACTIVE',
  }

  // 안전 파서
  const normalizeConversations = (arr: any): Conversation[] =>
    (Array.isArray(arr) ? arr : []).filter(Boolean).filter(c => !!c?.aiPersona)



  // 리스트(히스토리): 선택된 필터 적용
  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    const status = filterMap[selectedFilter] 
    fetch(`/api/conversations?status=${status}&page=1&size=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => setHistory(normalizeConversations(data?.content)))
      .catch(() => setError('불러오기 실패'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, selectedFilter])

  const getName = (name?: string) => (name && name.trim() ? name : 'Unknown')
  const getInitial = (name?: string) => getName(name).charAt(0)
  const getImg = (url?: string) => (typeof url === 'string' ? url : '')

  // 슬라이더 데이터

  return (
    <div className="bg-white w-full p-6 flex flex-col">
      <span className="text-left font-semibold text-xl my-10">Chat History</span>

      {/* Filter */}
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

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {(!history || history.length === 0) && !loading && (
            <p className="text-gray-400 text-center mt-10">No chat history.</p>
          )}

          {(history ?? []).map(chat => {
            const name = getName(chat?.aiPersona?.name)
            const desc = chat?.aiPersona?.description ?? ''
            const img = getImg(chat?.aiPersona?.profileImageUrl)
            return (
              <div
                key={chat?.conversationId ?? Math.random().toString(36).slice(2)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  {img && img.startsWith('http') ? (
                    <Image
                      src={img}
                      width={48}
                      height={48}
                      alt={name}
                      className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-gray-600 font-semibold text-sm">{getInitial(name)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black text-base">{name}</h3>
                  <p className="text-sm text-black truncate">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}