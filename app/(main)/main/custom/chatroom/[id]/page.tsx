/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation' // ✅ 동적 라우트 파람은 이걸로
import { MyAI } from '@/lib/types'
import { useAuth } from '@/lib/UserContext'
import Link from 'next/link'
import Image from "next/image"

type ConversationDetail = {
  conversationId: number
  userId: number
  aiPersona: MyAI
  status: 'ACTIVE' | 'ENDED'
  situation: string
  chatNodeId: string
  createdAt: string
  endedAt: string | null
}

export default function ChatroomPage() {
  // ✅ 페이지 컴포넌트에서 Promise로 받지 마세요. (use(params) ❌)
  const params = useParams<{ id: string }>()
  const id = params?.id // 동적 파라미터
  const router = useRouter();
  const { accessToken } = useAuth()

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [myAI, setMyAI] = useState<MyAI | null>(null)
  const canCall = Boolean(accessToken && id)

  useEffect(() => {
    if (!canCall) return
    const fetchAI = async () => {
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`Failed to fetch AI info: ${res.status}`)
        const data: ConversationDetail = await res.json()
        setMyAI(data.aiPersona)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAI()
  }, [accessToken, id, canCall]) 

  const fetchMessages = async () => {
    if (!canCall) return
    try {
      const res = await fetch(
        `/api/messages?conversationId=${id}&page=1&size=20`,
        { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' }
      )
      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`)
      const data = await res.json()
      setMessages(data.content || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, id]) // ✅ id/토큰 바뀌면 재조회

  // ✅ 메시지 전송
  const sendMessage = async () => {
    if (!canCall || !message.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId: Number(id), // id는 문자열 → 숫자 변환
          content: message,
          audioBase64: '',
        }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`Send failed: ${res.status} ${t}`)
      }
      setMessage('')
      await fetchMessages() // 전송 후 목록 새로고침
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
const handleEnd = async () => {
  try {
    const res = await fetch(`/api/conversations/${id}/end`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.error('Failed to end conversation');
      return;
    }
    router.push(`/main/custom/chatroom/${id}/result`)
    console.log("대화가 종료되었습니다.")
  } catch (error) {
    console.error('Error ending conversation:', error);
  }
};

  return (
     <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-blue-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between w-full">
          <Link href="/main" aria-label="Back">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-lg font-semibold text-black">{myAI?.name ?? '...'}</span>
          <button onClick={handleEnd} aria-label="End conversation">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white px-4 py-4 overflow-y-auto">
        {messages.map(m => {
          const isMine = m.type === 'USER'
          return (
            <div
              key={m.messageId ?? `${m.createdAt}-${m.type}`}
              className={`flex items-start mb-4 ${isMine ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {/* 상대방 아바타 */}
              {!isMine && (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-gray-200">
                  {myAI?.profileImageUrl ? (
                    <Image
                      src={myAI.profileImageUrl}
                      alt={myAI.name ?? 'AI Avatar'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* 말풍선 */}
              <div className={`max-w-[75%] ${isMine ? 'ml-auto' : ''}`}>
                <div className="text-sm font-medium text-black/80 mb-1">
                  {isMine ? '' : (myAI?.name ?? 'AI')}
                </div>

                <div
                  className={
                    `p-3 sm:p-4 rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,.04)] ` +
                    (isMine
                      ? 'bg-blue-50 text-gray-900 border-blue-200 rounded-br-md'
                      : 'bg-gray-100 text-black border-gray-200 rounded-tl-sm')
                  }
                >
                  <div className="whitespace-pre-wrap py-2 leading-relaxed text-[15px]">
                    {m.content}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div className="bg-blue-50 px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <button
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm"
            onClick={fetchMessages}
            aria-label="Refresh messages"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <div className="flex items-center bg-white rounded-full shadow-sm px-3 flex-1">
            <input
              className="flex-1 outline-none px-2 py-2 text-sm"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim() || !canCall}
              className="text-blue-500 font-semibold disabled:opacity-40 text-sm"
            >
              Send
            </button>
          </div>

          <button
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => console.log('record')}
            aria-label="Record"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-2">
          <div className="w-32 h-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  )
}