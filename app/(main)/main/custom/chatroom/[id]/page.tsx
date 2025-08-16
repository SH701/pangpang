/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MyAI } from '@/lib/types'
import { useAuth } from '@/lib/UserContext'
import Link from 'next/link'
import MessageList from '@/components/chats/MessageList'
import { HonorificResults } from '@/components/chats/HonorificSlider'


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
  conversationId: number
  role: 'USER' | 'AI'
  content: string
  createdAt: string
  feedback?: string
}

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [myAI, setMyAI] = useState<MyAI | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canCall = Boolean(accessToken)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null)
  const router = useRouter()
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [honorificResults, setHonorificResults] = useState<Record<string, HonorificResults>>({})
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({})


  // 대화 정보 로드
  useEffect(() => {
    if (!canCall || !id) return
    (async () => {
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        })
        if (!res.ok) {
          const errorText = await res.text()
          console.error('대화 정보 조회 실패:', res.status, errorText)
          setError(`대화 정보를 불러올 수 없습니다: ${res.status}`)
          return
        }
        const data: ConversationDetail = await res.json()
        setMyAI(data.aiPersona)
        setConversationId(data.conversationId)
        setError(null)
      } catch (err) {
        console.error('대화 정보 조회 오류:', err)
        setError('네트워크 오류가 발생했습니다')
      }
    })()
  }, [accessToken, id, canCall])

  // 메시지 목록 로드
  const fetchMessages = async () => {
    if (!canCall) return
    try {
      setError(null)
      const res = await fetch(`/api/messages?conversationId=${id}&page=1&size=20`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      })
      if (!res.ok) {
        const errorText = await res.text()
        console.error('메시지 조회 실패:', res.status, errorText)
        setError(`메시지를 불러올 수 없습니다: ${res.status}`)
        return
      }
      const data = await res.json()
      const list = (data?.content ?? data ?? []) as any[]
      const mapped: ChatMsg[] = list.map((m) => ({
        messageId: String(m.messageId),
        conversationId: m.conversationId,
        role: (m.role ?? m.type) as 'USER' | 'AI',
        content: m.content ?? '',
        createdAt: m.createdAt ?? new Date().toISOString(),
        
      }))
      
      setMessages(mapped)

      // 첫 메시지에서 conversationId 확보
      if (!conversationId && list.length > 0 && list[0].conversationId) {
        setConversationId(list[0].conversationId)
      }
    } catch (err) {
      console.error('메시지 조회 오류:', err)
      setError('메시지를 불러오는 중 오류가 발생했습니다')
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 메시지 전송
  const sendMessage = async () => {
    if (!canCall || !message.trim() || loading) return
    if (!conversationId) {
      setError('대화방 ID를 불러올 수 없습니다')
      return
    }

    const content = message.trim()
    setLoading(true)
    setError(null)

    const optimistic: ChatMsg = {
      messageId: `user_${Date.now()}`,
      conversationId,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    setMessage('')

    try {
      const userRes = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ conversationId, content }),
      })
      

      if (!userRes.ok) {
        const errorText = await userRes.text()
        setError(`메시지 전송 실패: ${userRes.status} ${errorText}`)
        setMessages(prev => prev.filter(msg => msg.messageId !== optimistic.messageId))
        setMessage(content)
        return
      }

      const userMsgData = await userRes.json()
      if (userMsgData?.messageId) {
        setMessages(prev =>
          prev.map(msg =>
            msg.messageId === optimistic.messageId
              ? { ...msg, messageId: String(userMsgData.messageId) }
              : msg
          )
        )
      }

      const aiRes = await fetch(`/api/messages/ai-reply?conversationId=${conversationId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!aiRes.ok) return

      const aiData = await aiRes.json()
      if (aiData?.content?.trim()) {
        setMessages(prev => [
          ...prev,
          {
            messageId: String(aiData.messageId ?? `ai_${Date.now()}`),
            conversationId,
            role: 'AI',
            content: aiData.content,
            createdAt: aiData.createdAt ?? new Date().toISOString(),
          },
        ])
      }
    } catch (e) {
      setError('네트워크 오류로 메시지를 전송할 수 없습니다')
      setMessages(prev => prev.filter(msg => msg.messageId !== optimistic.messageId))
      setMessage(content)
    } finally {
      setLoading(false)
    }
  }

  // 대화 종료
  const handleEnd = async () => {
    try {
      const res = await fetch(`/api/conversations/${id}/end`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        setError('대화를 종료할 수 없습니다')
        return
      }
      router.push(`/main/custom/chatroom/${id}/result`)
    } catch (error) {
      setError('대화 종료 중 오류가 발생했습니다')
    }
  }

const handleFeedbacks = async (messageId: string) => {
  if (!accessToken) {
    setError('인증 토큰이 없습니다.')
    return
  }
  if (feedbackOpenId === messageId) {
    setFeedbackOpenId(null)
    return
  }
  try {
    const res = await fetch(`/api/messages/${messageId}/feedback`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      
    })

    if (!res.ok) {
      const errText = await res.text()
      setError(`피드백 요청 실패: ${res.status} ${errText}`)
      return
    }

    const feedbackData = await res.json()
    setMessages(prev =>
  prev.map(msg =>
    msg.messageId === messageId
      ? { ...msg, feedback: feedbackData }   // ✅ 그대로 객체 저장
      : msg
  )
)

    setFeedbackOpenId(messageId)
  } catch (err) {
    setError('네트워크 오류로 피드백 요청 실패')
  }
}

const handleHonorific = async (messageId: string) => {
  // 토글: 이미 있으면 제거
  if (honorificResults[messageId]) {
    setHonorificResults(prev => {
      const copy = { ...prev }
      delete copy[messageId]
      return copy
    })
    setSliderValues(prev => {
      const copy = { ...prev }
      delete copy[messageId]
      return copy
    })
    return
  }

  try {
    // ✅ messageId만 path에 넣음, 쿼리 파라미터 제거
    const res = await fetch(`/api/messages/${messageId}/honorific-variations`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, },
    })
    
    if (!res.ok) {
      console.error('존댓말 변환 실패')
      return
    }

    const data = await res.json()

    // 결과 저장
    setHonorificResults(prev => ({
      ...prev,
      [messageId]: data,
    }))

    // 기본 슬라이더 값 1로 설정
    setSliderValues(prev => ({
      ...prev,
      [messageId]: 1,
    }))
  } catch (err) {
    console.error('handleHonorific error:', err)
  }
}



  return (
     <div className="min-h-screen bg-white flex flex-col max-w-[375px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between w-full">
          <Link href="/main" aria-label="Back" className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-lg font-semibold text-gray-900 font-pretendard">{myAI?.name ?? '...'}</span>
          <button 
            onClick={handleEnd} 
            aria-label="End conversation"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)}>X</button>
          </div>
        </div>
      )}

      {/* Messages */}
    <div className="flex-1 bg-white px-4 py-4 overflow-y-auto">
      <MessageList
        messages={messages}
        myAI={myAI}
        feedbackOpenId={feedbackOpenId}
        honorificResults={honorificResults}
        sliderValues={sliderValues}
        handleFeedbacks={handleFeedbacks}
        handleHonorific={handleHonorific}
        setSliderValues={setSliderValues}
      />
      <div ref={bottomRef} />
    </div>

      {/* Input */}
      <div className="bg-blue-50 px-4 py-4 border-t border-gray-200 w-[375px]">
        <div className="flex items-center bg-white rounded-full px-3 flex-1">
          <input
            className="flex-1 outline-none px-2 py-2 text-sm"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="text-blue-500 font-semibold">Send</button>
        </div>
      </div>
    </div>
  )
}
