/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { HonorificResults } from './HonorificSlider'
import MessageItem from './MessageItem'
import { MyAI } from '@/lib/types'

type MessageListProps = {
  messages: any[]
  myAI: MyAI | null
  feedbackOpenId: string | null
  honorificResults: Record<string, Record<number, HonorificResults>>
  sliderValues: Record<string, number>
  handleFeedbacks: (messageId: string) => void
 handleHonorific: (messageId: string, content: string, aiRole?: string) => Promise<void>
  setSliderValues: React.Dispatch<React.SetStateAction<Record<string, number>>>
  messageStatuses?: Record<string, 'default' | 'error'>
}

export default function MessageList({
  messages,
  myAI,
  feedbackOpenId,
  honorificResults,
  sliderValues,
  handleFeedbacks,
  handleHonorific,
  setSliderValues,
  messageStatuses = {},
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
            messageStatus={messageStatuses[m.messageId] || 'default'}
          />
        )
      })}
    </>
  )
}
