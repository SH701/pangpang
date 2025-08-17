/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MyAI } from '@/lib/types'
import HonorificSlider, { HonorificResults } from './HonorificSlider'

type MessageItemProps = {
  m: any
  myAI: MyAI | null
  isMine: boolean
  isFeedbackOpen: boolean
  feedbackOpenId: string | null
  honorificResults: Record<string, Record<number, HonorificResults>>
  sliderValues: Record<string, number>
  handleFeedbacks: (messageId: string) => void
  handleHonorific: (messageId: string, content: string, aiRole?: string) => Promise<void>
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
  messageStatus = 'default',
}: MessageItemProps) {
  const [isErrorOpen, setIsErrorOpen] = useState(false)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<Record<string, boolean>>({})


  // 버튼 클릭 → 로딩 → API 호출 → 로딩 해제
  const handleClick = async () => {
    setLoading((prev) => ({ ...prev, [m.messageId]: true }))
    await handleHonorific(m.messageId, m.content, myAI?.aiRole)
    setLoading((prev) => ({ ...prev, [m.messageId]: false }))
  }
  const handleFeedbackClick = async () => {
  setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: true }))
  await handleFeedbacks(m.messageId)
  setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: false }))
}

  return (
    <div className={`flex items-start mb-4 ${isMine ? 'justify-end' : 'justify-start'} gap-3`}>
      {/* 상대방 프로필 이미지 */}
      {!isMine && (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-gray-200">
          {myAI?.profileImageUrl ? (
            <Image
              src={myAI.profileImageUrl}
              alt={myAI?.name ?? 'AI Avatar'}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      )}

      {/* 메시지 박스 */}
      <div className={`max-w-[75%] ${isMine ? 'ml-auto' : ''}`}>
        <div className="text-sm font-medium text-gray-600 mb-1 font-pretendard">
          {isMine ? '' : myAI?.name ?? 'AI'}
        </div>

        <div className="flex items-center gap-1.5">
          {/* 오류 상태일 때 info 아이콘 */}
          {isMine && messageStatus === 'error' && (
            <button
              onClick={() => setIsErrorOpen(!isErrorOpen)}
              className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
            >
              <span className="text-red-500 text-xs font-bold leading-none">i</span>
            </button>
          )}

          {/* 메시지 풍선 */}
<div
  className={`p-3 sm:p-4 rounded-2xl border shadow-sm w-full
    ${isMine
      ? messageStatus === 'error'
        ? 'border-red-500 bg-white'
        : isFeedbackOpen && m.feedback
          ? 'border-red-500 bg-white' 
          : 'bg-white text-black border-gray-200'
      : 'bg-gray-50 border-gray-200'
    }`}
  data-message-id={m.messageId}
  data-message-status={messageStatus}
>
  <div className="flex flex-col gap-3">
    <div className="whitespace-pre-wrap py-2 flex-1 text-black text-sm font-normal leading-[130%]">
      {m.content}
    </div>

              {/* 버튼 영역 */}
              {isMine && (
                <div className="flex items-center justify-between gap-2">
                  <button
  className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
  onClick={handleFeedbackClick}
  disabled={loadingFeedbacks[m.messageId]}
>
  {loadingFeedbacks[m.messageId] ? (
    <svg className="animate-spin w-3 h-3 text-gray-600" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
  ) : (
    <svg
      className="w-3 h-3 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )}
</button>


                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 flex-shrink-0 font-pretendard transition-colors"
                    onClick={handleClick}
                  >
                    존댓말
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 피드백 */}
     {isMine && isFeedbackOpen && m.feedback && (
  <div className="p-4 bg-gray-600 rounded-xl shadow-sm -mt-6">
    <div className="text-white font-pretendard text-sm pb-2 mt-5 border-b border-gray-400">
      {m.feedback.appropriateExpression}
    </div>
    <div className="text-gray-200 font-pretendard text-sm pt-2">
      {m.feedback.explain}
    </div>
  </div>
)}

        {/* 에러 메시지 */}
        {isMine && messageStatus === 'error' && isErrorOpen && (
          <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3">
            <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">Error Details</h3>
            <p className="text-white font-pretendard text-sm">
              This message contains an error that needs attention.
            </p>
          </div>
        )}

        {/* 존댓말 로딩 */}
        {isMine && loading[m.messageId] && (
          <div className="mt-2 p-3 rounded-2xl bg-gray-600 text-white text-sm flex items-center gap-2 w-full">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
           Loading...
          </div>
        )}

        {/* 존댓말 결과 */}
        {isMine && honorificResults[m.messageId] && !loading[m.messageId] && (
          <HonorificSlider
            results={honorificResults[m.messageId] as HonorificResults}
            value={sliderValues[m.messageId] ?? 1}
            onChange={(newValue) =>
              setSliderValues((prev) => ({
                ...prev,
                [m.messageId]: newValue,
              }))
            }
          />
        )}
      </div>
    </div>
  )
}
