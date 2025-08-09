/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation' // ✅ 동적 라우트 파람은 이걸로
import { MyAI } from '@/lib/types'
import { useAuth } from '@/lib/UserContext'
import Link from 'next/link'

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
      {/* Header Bar */}
      <div className="bg-white border-b border-blue-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/main">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lg font-semibold text-black">{myAI?.name ?? '...'}</span>
          </div>
          <button onClick={handleEnd}>
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          </button>
        </div>
      </div>

      {/* Chat Content Area */}
      <div className="flex-1 bg-white px-4 py-4 overflow-y-auto">
        {messages.map((msg: any) => (
          <div key={msg.messageId ?? `${msg.createdAt}-${msg.type}`} className="flex items-start space-x-3 mb-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {/* Message Content */}
            <div className="flex-1">
              <div className="text-sm font-medium text-black mb-1">
                {msg.type === 'USER' ? '나' : myAI?.name ?? 'AI'}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <div className="text-black mb-3 whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-blue-50 px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          {/* Refresh */}
          <button
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm"
            onClick={fetchMessages}
            aria-label="Refresh messages"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Input + Send */}
          <div className="flex items-center bg-white rounded-full shadow-sm px-3 flex-1">
            <input
              className="flex-1 outline-none px-2 py-2 text-sm"
              placeholder="메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim() || !canCall}
              className="text-blue-500 font-semibold disabled:opacity-40"
            >
              전송
            </button>
          </div>

          {/* Mic (미구현) */}
          <button
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => console.log('마이크 녹음 시작')}
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
