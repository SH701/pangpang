/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import MessageItem from './MessageItem'
import { MyAI } from '@/lib/types'
import type { HonorificResults } from './HonorificSlider' // ✅ 타입 가져오기

type MessageListProps = {
  messages: any[]
  myAI: MyAI | null
  feedbackOpenId: string | null
  honorificResults: Record<string, HonorificResults> 
  sliderValues: Record<string, number>
  handleFeedbacks: (messageId: string) => void
  handleHonorific: (messageId: string) => void
  setSliderValues: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export default function MessageList({
  messages,
  myAI,
  feedbackOpenId,
  honorificResults,
  sliderValues,
  handleFeedbacks,
  handleHonorific,
  setSliderValues
}: MessageListProps) {
  return (
    <>
      {messages.map((m) => {
        const isMine = m.role === 'USER'
        const isFeedbackOpen = feedbackOpenId === m.messageId
        return (
          <MessageItem
            key={m.messageId}
            m={m}
            myAI={myAI}
            isMine={isMine}
            isFeedbackOpen={isFeedbackOpen}
            feedbackOpenId={feedbackOpenId}
            honorificResults={honorificResults}
            sliderValues={sliderValues}
            handleFeedbacks={handleFeedbacks}
            handleHonorific={handleHonorific}
            setSliderValues={setSliderValues}
          />
        )
      })}
    </>
  )
}
