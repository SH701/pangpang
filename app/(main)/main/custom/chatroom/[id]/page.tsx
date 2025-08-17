/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MyAI } from '@/lib/types'
import { useAuth } from '@/lib/UserContext'
import Link from 'next/link'
import MessageList from '@/components/chats/MessageList'

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
  const [honorificResults, setHonorificResults] = useState<Record<string, Record<number, string>>>({})
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({})
  const [messageStatuses, setMessageStatuses] = useState<Record<string, 'default' | 'error'>>({})
  const [isChatInputOpen, setIsChatInputOpen] = useState(false)
  
  // 테스트용: 첫 번째 메시지를 오류 상태로 설정
  useEffect(() => {
    if (messages.length > 0) {
      const firstMessageId = messages[0]?.messageId
      if (firstMessageId) {
        setMessageStatuses(prev => ({
          ...prev,
          [firstMessageId]: 'error'
        }))
      }
    }
  }, [messages])


  // 대화 정보 로드
  useEffect(() => {
    if (!canCall || !id) return
    ;(async () => {
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
        const newMessageId = String(userMsgData.messageId)
        
        // 메시지 ID 업데이트
        setMessages(prev => 
          prev.map(msg => 
            msg.messageId === optimistic.messageId 
              ? { ...msg, messageId: newMessageId }
              : msg
          )
        )
        
        // messageStatuses도 함께 업데이트 (오류 상태 유지)
        if (messageStatuses[optimistic.messageId]) {
          console.log('상태 마이그레이션:', optimistic.messageId, '->', newMessageId, messageStatuses[optimistic.messageId])
          setMessageStatuses(prev => ({
            ...prev,
            [newMessageId]: prev[optimistic.messageId]
          }))
          // 이전 상태 제거
          setMessageStatuses(prev => {
            const newStatuses = { ...prev }
            delete newStatuses[optimistic.messageId]
            console.log('마이그레이션 후 상태:', newStatuses)
            return newStatuses
          })
        }
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

  // 이미 열려있으면 닫기
  if (feedbackOpenId === messageId) {
    setFeedbackOpenId(null)
    return
  }

  try {
    const res = await fetch(`/api/feedbacks/message/${messageId}`, {
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
          ? { ...msg, feedback: feedbackData.content ?? JSON.stringify(feedbackData) }
          : msg
      )
    )

    setFeedbackOpenId(messageId)
  } catch (err) {
    setError('네트워크 오류로 피드백 요청 실패')
  }
}
const handleHonorific = async (messageId: string, sourceContent: string, aiRole?: string) => {
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
    const params = new URLSearchParams()
    params.set('sourceContent', sourceContent)
    if (aiRole) params.set('aiRole', aiRole)

    const res = await fetch(`/api/language/honorific-variations?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      console.error('존댓말 변환 실패')
      return
    }

    const data = await res.json()

    const levelMap: Record<number, string> = {}
    Object.entries(data).forEach(([key, value]) => {
      const match = key.match(/\d+/) // honorificLevel1 → 1
      if (match) {
        const levelNum = Number(match[0])
        levelMap[levelNum] = String(value)
      }
    })

    // 결과 저장
    setHonorificResults(prev => ({
      ...prev,
      [messageId]: levelMap,
    }))

    // 기본 슬라이더 값 1로 설정 (3단계 중 중간)
    setSliderValues(prev => ({
      ...prev,
      [messageId]: 1,
    }))
  } catch (err) {
    console.error('handleHonorific error:', err)
    // 에러 발생 시 메시지 상태를 error로 설정
    setMessageStatuses(prev => ({
      ...prev,
      [messageId]: 'error'
    }))
  }
}

// 메시지 상태를 변경하는 함수
const setMessageStatus = (messageId: string, status: 'default' | 'error') => {
  setMessageStatuses(prev => ({
    ...prev,
    [messageId]: status
  }))
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
            aria-label="Exit chatroom"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex justify-between">
            <p className="text-sm text-red-700 font-pretendard">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">X</button>
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
        messageStatuses={messageStatuses}
      />
        <div ref={bottomRef} />
      </div>

      {/* Bottom Design */}
      <div className="bg-white px-6 py-6 border-t border-gray-200">
        {!isChatInputOpen ? (
          /* 3개 원형 버튼 디자인 */
          <div className="flex items-center justify-center space-x-8">
            {/* 왼쪽 버튼 - X 아이콘 (빨간색) */}
            <button
              className="w-14 h-14 bg-red-800 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
              onClick={() => console.log('X button clicked')}
              aria-label="Close"
            >
              <span className="text-white text-2xl font-bold">×</span>
            </button>
            
            {/* 중앙 버튼 - 말하기 (파란색) */}
          <button
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors"
              onClick={() => console.log('Voice button clicked')}
              aria-label="Voice input"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

            {/* 오른쪽 버튼 - 키보드 아이콘 (회색) */}
            <button
              className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600 transition-colors"
              onClick={() => setIsChatInputOpen(true)}
              aria-label="Open typing input"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        ) : (
          /* 채팅 입력 필드 */
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center bg-white rounded-full shadow-sm px-3 flex-1 border border-gray-200">
            <input
                className="flex-1 outline-none px-2 py-2 text-sm font-pretendard placeholder-gray-400"
                placeholder="메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim() || !canCall}
                className="text-blue-600 font-semibold disabled:opacity-50 text-sm font-pretendard hover:text-blue-700 transition-colors"
            >
                {loading ? '전송중...' : '전송'}
            </button>
          </div>

          <button
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-blue-700 transition-colors"
              onClick={() => setIsChatInputOpen(false)}
              aria-label="Back to voice input"
            disabled={loading}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
        )}

        {/* 하단 인디케이터 바 */}
        <div className="flex justify-center mt-4">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  )
}
