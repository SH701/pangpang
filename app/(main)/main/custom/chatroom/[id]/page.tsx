/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MyAI } from '@/lib/types'
import { useAuth } from '@/lib/UserContext'
import Link from 'next/link'
import Image from 'next/image'

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

type ChatMsg = {
  messageId: string
  role: 'USER' | 'AI'
  content: string
  createdAt: string
}

export default function ChatroomPage() {
  const params = useParams<{ id: string }>()
  const rawId = params?.id
const convId = Number.parseInt(
  Array.isArray(rawId) ? rawId[0] : (rawId ?? ''),
  10
)
const hasValidId = Number.isFinite(convId) && convId > 0

  const router = useRouter()
  const { accessToken } = useAuth()

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [myAI, setMyAI] = useState<MyAI | null>(null)
const canCall = Boolean(accessToken && hasValidId)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ✅ 대화 정보(페르소나) 불러오기
  useEffect(() => {
    if (!canCall) return
    ;(async () => {
      try {
        const res = await fetch(`/api/conversations/${convId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`Failed to fetch AI info: ${res.status}`)
        const data: ConversationDetail = await res.json()
        setMyAI(data.aiPersona)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [accessToken, convId, canCall])

  // ✅ 과거 메시지 불러오기 (백엔드가 role 대신 type을 줄 수도 있어서 매핑)
  const fetchMessages = async () => {
    if (!canCall) return
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}&page=1&size=20`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`)
      const data = await res.json()
      const list = (data?.content ?? data ?? []) as any[]
      const mapped: ChatMsg[] = list.map((m) => ({
        messageId: String(m.messageId ?? `${m.createdAt}-${m.role ?? m.type}`),
        role: (m.role ?? m.type) as 'USER' | 'AI',
        content: m.content ?? '',
        createdAt: m.createdAt ?? new Date().toISOString(),
      }))
      setMessages(mapped)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, convId])

  // ✅ 항상 하단으로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function normalizeAiReply(data: any): ChatMsg[] {
  // 1) { userMessage: {...}, aiMessage: {...} }
  if (data?.userMessage || data?.aiMessage) {
    const u = data.userMessage
      ? {
          messageId: String(data.userMessage.messageId ?? `u_${Date.now()}`),
          role: (data.userMessage.role ?? data.userMessage.type ?? 'USER') as 'USER' | 'AI',
          content: data.userMessage.content ?? '',
          createdAt: data.userMessage.createdAt ?? new Date().toISOString(),
        }
      : null

    const a = data.aiMessage
      ? {
          messageId: String(data.aiMessage.messageId ?? `a_${Date.now()}`),
          role: (data.aiMessage.role ?? data.aiMessage.type ?? 'AI') as 'USER' | 'AI',
          content: data.aiMessage.content ?? '',
          createdAt: data.aiMessage.createdAt ?? new Date().toISOString(),
        }
      : null

    return [u, a].filter(Boolean) as ChatMsg[]
  }

  // 2) [{...}, {...}] 배열로 올 때
  if (Array.isArray(data)) {
    return data.map((m: any) => ({
      messageId: String(m.messageId ?? `${m.createdAt}-${m.role ?? m.type}`),
      role: (m.role ?? m.type ?? 'AI') as 'USER' | 'AI',
      content: m.content ?? '',
      createdAt: m.createdAt ?? new Date().toISOString(),
    }))
  }

  // 3) 단일 객체만 올 때 (최소한 AI 답변)
  if (data && typeof data === 'object') {
    return [
      {
        messageId: String(data.messageId ?? `m_${Date.now()}`),
        role: (data.role ?? data.type ?? 'AI') as 'USER' | 'AI',
        content: data.content ?? '',
        createdAt: data.createdAt ?? new Date().toISOString(),
      },
    ]
  }

  return []
}
  // ✅ 유저 전송 → /api/messages/ai-reply 호출 → AI 응답 추가 (낙관적 업데이트)
const sendMessage = async () => {
  if (!canCall || !message.trim() || loading) return
  const content = message.trim()
  setLoading(true)

  try {
    const res = await fetch('/api/messages/ai-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        conversationId: Number(convId), // convId 쓰고 있으면 convId로 교체
        content,
      }),
    })

    if (!res.ok) {
      const t = await res.text()
      throw new Error(`ai-reply failed: ${res.status} ${t}`)
    }

    const data = await res.json()
    const bundle = normalizeAiReply(data)

    // ✅ 전송 완료된 후에 한 번에: [유저메시지, AI메시지] 추가
    setMessages(prev => [...prev, ...bundle])
    setMessage('')
  } catch (e) {
    console.error(e)
  } finally {
    setLoading(false)
  }
}

  // ✅ 대화 종료
  const handleEnd = async () => {
    try {
      const res = await fetch(`/api/conversations/${convId}/end`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        console.error('Failed to end conversation')
        return
      }
      router.push(`/main/custom/chatroom/${convId}/result`)
    } catch (error) {
      console.error('Error ending conversation:', error)
    }
  }

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
        {messages.map((m) => {
          const isMine = m.role === 'USER'
          return (
            <div
              key={m.messageId}
              className={`flex items-start mb-4 ${isMine ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {/* 상대방 아바타 */}
              {!isMine && (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-gray-200">
                  {myAI?.profileImageUrl ? (
                    <Image
                      src={myAI.profileImageUrl}
                      alt={myAI?.name ?? 'AI Avatar'}
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
        <div ref={bottomRef} />
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
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim() || !canCall}
              className="text-blue-500 font-semibold disabled:opacity-40 text-sm"
            >
              {loading ? 'Sending...' : 'Send'}
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
