/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { InformationCircleIcon } from '@heroicons/react/24/solid'

import { MyAI } from '@/lib/types'
import HonorificSlider from './Honorific'

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
  setSliderValues
}: MessageItemProps) {
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
        <div className="text-sm font-medium text-black/80 mb-1">{isMine ? '' : myAI?.name ?? 'AI'}</div>
        <div
          className={`p-3 sm:p-4 rounded-2xl border shadow relative
            ${isMine
              ? isFeedbackOpen
                ? 'border-red-500 bg-white'
                : 'bg-blue-600, text-white border-blue-200'
              : 'bg-gray-50 border-gray-200'
            }`}
        >
          {isMine && (
            <button
              className="absolute -left-6 top-1/2 -translate-y-1/2 text-red-500"
              onClick={() => handleFeedbacks(m.messageId)}
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          )}

          <div className="flex justify-between items-center gap-2 flex-col">
            <div className="whitespace-pre-wrap py-2 flex-1">{m.content}</div>
            {isMine && (
              <>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 flex-shrink-0"
                  onClick={() => handleHonorific(m.messageId, m.content, myAI?.aiRole)}
                >
                  존댓말
                </button>
                {honorificResults[m.messageId] && (
                  <HonorificSlider
                    results={honorificResults[m.messageId]}
                    value={sliderValues[m.messageId] ?? 1}
                    onChange={(newValue) =>
                      setSliderValues((prev) => ({
                        ...prev,
                        [m.messageId]: newValue
                      }))
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>

        {isMine && isFeedbackOpen && m.feedback && (
          <div className="mt-2 p-3 rounded-2xl bg-white border border-red-500 text-sm">{m.feedback}</div>
        )}
      </div>
    </div>
  )
}
