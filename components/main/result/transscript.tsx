/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

type ChatMsg = {
  messageId: number
  role: 'USER' | 'AI'
  content: string
}

export default function Transcript({messages,aiName,}: { messages: ChatMsg[]; aiName: string }) {
  const [openHonorificId, setOpenHonorificId] = useState<number | null>(null)
  const [openErrorId, setOpenErrorId] = useState<number | null>(null)
  const [sliderValue, setSliderValue] = useState(1)


  return (
    <div className="space-y-4 ">
      {messages.map((m) =>
        m.role === 'AI' ? (
          <div key={m.messageId}>
            <p className="text-xs font-semibold text-gray-600 mb-2 font-pretendard">{aiName}</p>
            <div className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 max-w-[228px]">
              <p className="text-sm font-pretendard leading-relaxed text-gray-900">{m.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex gap-2">
              </div>
            </div>
          </div>
        ) : (
          <div key={m.messageId} className="flex justify-end">
            <div className="flex items-center gap-1.5">
              {/* 에러 토글 버튼 */}
              <button
                onClick={() =>
                  setOpenErrorId(openErrorId === m.messageId ? null : m.messageId)
                }
                className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span className="text-red-500 text-xs font-bold leading-none">i</span>
              </button>

              <div className="bg-white p-3 rounded-xl shadow-sm border border-red-500 max-w-[228px]">
                <p className="text-sm font-pretendard leading-relaxed text-black">{m.content}</p>
                <div className="text-xs text-gray-500 mt-2 flex gap-2 justify-end">
                  <button
                    onClick={() =>
                      setOpenHonorificId(
                        openHonorificId === m.messageId ? null : m.messageId
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-pretendard transition-colors"
                  >
                    존댓말
                  </button>
                </div>
              </div>
            </div>
            {openErrorId === m.messageId && (
              <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3">
                <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">
                  Error Details
                </h3>
                <p className="text-white font-pretendard text-sm">
                  This message contains an error that needs attention.
                </p>
              </div>
            )}
            {openHonorificId === m.messageId && (
              <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3">
                <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">
                  Formality Level
                </h3>
                <input
                  type="range"
                  min={0}
                  max={2}
                  value={sliderValue}
                  onChange={(e: { target: { value: any } }) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}