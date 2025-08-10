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
  const id= params?.id

  

  // 디버깅용 로그 추가


  const router = useRouter()
  const { accessToken } = useAuth()

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [myAI, setMyAI] = useState<MyAI | null>(null)
  const [error, setError] = useState<string | null>(null) // 에러 상태 추가
  const canCall = Boolean(accessToken)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ✅ 대화 정보(페르소나) 불러오기
  useEffect(() => {
    if (!canCall) return
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
        setError(null) // 성공시 에러 초기화
      } catch (err) {
        console.error('대화 정보 조회 오류:', err)
        setError('네트워크 오류가 발생했습니다')
      }
    })()
  }, [accessToken, id, canCall])

  // ✅ 과거 메시지 불러오기 (백엔드가 role 대신 type을 줄 수도 있어서 매핑)
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
      console.log('받은 메시지 데이터:', data) // 디버깅용
      
      const list = (data?.content ?? data ?? []) as any[]
      const mapped: ChatMsg[] = list.map((m) => ({
        messageId: String(m.messageId ?? `${m.createdAt}-${m.role ?? m.type}`),
        role: (m.role ?? m.type) as 'USER' | 'AI',
        content: m.content ?? '',
        createdAt: m.createdAt ?? new Date().toISOString(),
      }))
      setMessages(mapped)
    } catch (err) {
      console.error('메시지 조회 오류:', err)
      setError('메시지를 불러오는 중 오류가 발생했습니다')
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, id])

  // ✅ 항상 하단으로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function normalizeAiReply(data: any): ChatMsg[] {
    console.log('정규화할 AI 응답 데이터:', data) // 디버깅용
    
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

  // ✅ 2단계 메시지 전송: 1) 사용자 메시지 전송 2) AI 응답 요청
  const sendMessage = async () => {
    if (!canCall || !message.trim() || loading) return
    
    // conversationId 유효성 재확인
    if (!id) {
      setError('유효하지 않은 대화방 ID입니다')
      return
    }
    
    const content = message.trim()
    setLoading(true)
    setError(null)

    // 먼저 사용자 메시지를 화면에 추가 (낙관적 업데이트)
    const userMessage: ChatMsg = {
      messageId: `user_${Date.now()}`,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setMessage('') // 입력창 즉시 비우기

    const requestBody = {
      conversationId: Number(id),
      content: content,
    }

    try {
         // 1단계: 사용자 메시지 전송
      const userRes = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log('사용자 메시지 전송 응답 상태:', userRes.status)

      if (!userRes.ok) {
        const errorText = await userRes.text()
        console.error('사용자 메시지 전송 실패:', userRes.status, errorText)
        setError(`메시지 전송 실패: ${userRes.status} ${errorText}`)
        // 실패시 사용자 메시지 제거
        setMessages(prev => prev.filter(msg => msg.messageId !== userMessage.messageId))
        setMessage(content) // 입력창에 다시 복원
        return
      }

      const userMsgData = await userRes.json()
      console.log('사용자 메시지 전송 완료:', userMsgData)

      // 사용자 메시지 ID 업데이트 (서버에서 생성된 ID로)
      if (userMsgData?.messageId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.messageId === userMessage.messageId 
              ? { ...msg, messageId: String(userMsgData.messageId) }
              : msg
          )
        )
      }

      console.log('=== 2단계: AI 응답 요청 ===')
      console.log('URL:', '/api/messages/ai-reply')
      console.log('요청 본문:', requestBody)
      
      // 2단계: AI 응답 요청
      const aiRes = await fetch('/api/messages/ai-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log('AI 응답 요청 응답 상태:', aiRes.status)

      if (!aiRes.ok) {
        const errorText = await aiRes.text()
        console.error('=== AI 응답 요청 실패 ===')
        console.error('상태 코드:', aiRes.status)
        console.error('오류 내용:', errorText)
        
        // JSON 파싱 시도
        try {
          const errorJson = JSON.parse(errorText)
          console.error('파싱된 오류:', errorJson)
        } catch {
          console.error('JSON 파싱 실패, 원문:', errorText)
        }
        
        setError(`AI 응답 요청 실패: ${aiRes.status} ${errorText}`)
        return // 사용자 메시지는 이미 전송되었으므로 제거하지 않음
      }

      const aiData = await aiRes.json()
      console.log('=== AI 응답 수신 완료 ===')
      console.log('AI 응답 데이터:', aiData)
      
      const bundle = normalizeAiReply(aiData)
      console.log('정규화된 AI 메시지:', bundle)

      // AI 응답만 추가
      const aiMessages = bundle.filter(msg => msg.role === 'AI')
      if (aiMessages.length > 0) {
        setMessages(prev => [...prev, ...aiMessages])
        console.log('AI 메시지 화면에 추가됨:', aiMessages)
      } else {
        console.warn('AI 응답에서 AI 메시지를 찾을 수 없음')
      }

    } catch (e) {
      console.error('=== 네트워크 오류 ===')
      console.error('오류 객체:', e)
      setError('네트워크 오류로 메시지를 전송할 수 없습니다')
      // 실패시 사용자 메시지 제거
      setMessages(prev => prev.filter(msg => msg.messageId !== userMessage.messageId))
      setMessage(content) // 입력창에 다시 복원
    } finally {
      setLoading(false)
    }
  }

  // ✅ 대화 종료
  const handleEnd = async () => {
    try {
      const res = await fetch(`/api/conversations/${id}/end`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        console.error('대화 종료 실패:', res.status)
        setError('대화를 종료할 수 없습니다')
        return
      }
      router.push(`/main/custom/chatroom/${id}/result`)
    } catch (error) {
      console.error('대화 종료 오류:', error)
      setError('대화 종료 중 오류가 발생했습니다')
    }
  }

  // 연결 상태 확인
  if (!id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">잘못된 대화 ID</h2>
          <p className="text-gray-600">유효하지 않은 대화방입니다.</p>
          <Link href="/main" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">인증 필요</h2>
          <p className="text-gray-600">로그인이 필요합니다.</p>
        </div>
      </div>
    )
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 bg-white px-4 py-4 overflow-y-auto">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            <p>대화를 시작해보세요!</p>
          </div>
        )}
        
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
        
        {/* 로딩 표시 */}
        {loading && (
          <div className="flex items-start mb-4 justify-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-gray-200">
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="max-w-[75%]">
              <div className="text-sm font-medium text-black/80 mb-1">
                {myAI?.name ?? 'AI'}
              </div>
              <div className="bg-gray-100 text-black border-gray-200 border rounded-2xl rounded-tl-sm p-3 sm:p-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>

      {/* Bottom bar */}
      <div className="bg-blue-50 px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <button
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm"
            onClick={fetchMessages}
            aria-label="Refresh messages"
            disabled={loading}
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
              disabled={loading}
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
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
            onClick={() => console.log('record')}
            aria-label="Record"
            disabled={loading}
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