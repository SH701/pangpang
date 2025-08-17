/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MyAI } from '@/lib/types'

type MessageItemProps = {
  m: any
  myAI: MyAI | null
  isMine: boolean
  isFeedbackOpen: boolean
  feedbackOpenId: string | null
  honorificResults: Record<string, Record<number, string>>
  sliderValues: Record<string, number>
  handleFeedbacks: (messageId: string) => void
  handleHonorific: (messageId: string, content: string, aiRole?: string) => void
  setSliderValues: React.Dispatch<React.SetStateAction<Record<string, number>>>
  messageStatus?: 'default' | 'error'
}

export default function MessageItem({
  m,
  myAI,
  isMine,
  isFeedbackOpen,
  honorificResults,
  sliderValues,
  handleFeedbacks,
  handleHonorific,
  setSliderValues,
  messageStatus = 'default'
}: MessageItemProps) {
  const [isErrorOpen, setIsErrorOpen] = useState(false)
  return (
    <div className={`flex items-start mb-4 ${isMine ? 'justify-end' : 'justify-start'} gap-3`}>
      {!isMine && (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-gray-200">
          {myAI?.profileImageUrl ? (
            <Image src={myAI.profileImageUrl} alt={myAI?.name ?? 'AI Avatar'} width={40} height={40} />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      )}
      
      <div className={`max-w-[75%] ${isMine ? 'ml-auto' : ''}`}>
        <div className="text-sm font-medium text-gray-600 mb-1 font-pretendard">{isMine ? '' : myAI?.name ?? 'AI'}</div>
        
        <div className="flex items-center gap-1.5">
          {/* 오류 상태일 때 좌측에 분리된 투명한 빨간 원형 정보 아이콘 */}
          {isMine && messageStatus === 'error' && (
            <button
              onClick={() => setIsErrorOpen(!isErrorOpen)}
              className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
            >
              <span className="text-red-500 text-xs font-bold leading-none">i</span>
            </button>
          )}
          
          <div
            className={`p-3 sm:p-4 rounded-2xl border shadow-sm max-w-[228px]
              ${isMine
                ? messageStatus === 'error'
                  ? 'border-red-500 bg-white'
                  : 'bg-white text-black border-gray-200'
                : 'bg-gray-50 border-gray-200'
              }`}
            data-message-id={m.messageId}
            data-message-status={messageStatus}
          >
            <div className="flex flex-col gap-3">
              <div className="whitespace-pre-wrap py-2 flex-1 text-black text-sm font-normal leading-[130%]">{m.content}</div>
              {isMine && (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={() => handleFeedbacks(m.messageId)}
                    >
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 flex-shrink-0 font-pretendard transition-colors"
                      onClick={() => handleHonorific(m.messageId, m.content, myAI?.aiRole)}
                    >
                      존댓말
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isMine && isFeedbackOpen && m.feedback && (
          <div className="mt-2 p-3 rounded-2xl bg-white border border-red-500 text-sm font-pretendard">{m.feedback}</div>
        )}

        {/* 에러 메시지 - 슬라이더 말풍선과 동일한 스타일 */}
        {isMine && messageStatus === 'error' && isErrorOpen && (
          <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3">
            <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">Error Details</h3>
            <p className="text-white font-pretendard text-sm">This message contains an error that needs attention.</p>
          </div>
        )}

        {/* 존댓말 드롭다운 - 메시지 박스와 완전히 분리 */}
        {isMine && honorificResults[m.messageId] && (
          <div 
            className="honorific-dropdown p-4 bg-gray-600 rounded-xl shadow-sm mt-3"
          >
            <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">Formality Level</h3>
            <p className="mb-3 text-white font-pretendard text-sm">{honorificResults[m.messageId][sliderValues[m.messageId] ?? 1]}</p>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={2}
                value={sliderValues[m.messageId] ?? 1}
                onChange={(e) =>
                  setSliderValues((prev) => ({
                    ...prev,
                    [m.messageId]: Number(e.target.value)
                  }))
                }
                className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer slider-blue"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(sliderValues[m.messageId] ?? 1) * 50}%, #6B7280 ${(sliderValues[m.messageId] ?? 1) * 50}%, #6B7280 100%)`
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <span className="text-xs text-white font-pretendard">Casual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white font-pretendard">Official</span>
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}