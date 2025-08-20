/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/UserContext";
import { useState } from "react";

type ChatMsg = {
  messageId: number;
  role: "USER" | "AI";
  content: string;
  feedback?: string; // 피드백 값 추가
  politenessScore?: number;
  naturalnessScore?: number;
};

export default function Transcript({
  messages,
  aiName,
}: {
  messages: ChatMsg[];
  aiName: string;
}) {
  const { accessToken } = useAuth();
  const [openHonorificId, setOpenHonorificId] = useState<number | null>(null);
  const [openErrorId, setOpenErrorId] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(1);
  const [feedbacks, setFeedbacks] = useState<
    Record<number, { explain: string; appropriateExpression: string }>
  >({});
  const handleFeedback = async (messageId: number) => {
    try {
      const res = await fetch(`/api/feedback/${messageId}`, {
        method: "POST", // 피드백을 생성하는 방식이 POST일 경우
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 필요한 인증 토큰
        },
      });
      if (!res.ok) {
        const errorText = await res.text(); // 오류 내용 확인
        throw new Error(`Feedback API failed: ${res.status} - ${errorText}`);
      }

      const feedbackData = await res.json();

      setFeedbacks((prev) => ({
        ...prev,
        [messageId]: {
          explain: feedbackData.explain,
          appropriateExpression: feedbackData.appropriateExpression,
        },
      }));
    } catch (error) {
      console.error("피드백 처리 중 오류 발생:", error);
    }
  };
  const handleHonorific = async (messageId: number) => {
    try {
      const res = await fetch(
        `/api/messages/${messageId}/honorific-variations`,
        {
          method: "GET", // 요청 방식, 필요에 따라 변경
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // 필요한 인증 토큰
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Honorific API failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("존댓말 변환 완료:", data);

      // 처리 후 필요한 로직 추가
    } catch (error) {
      console.error("존댓말 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((m) =>
        m.role === "AI" ? (
          <div key={m.messageId} className="flex gap-4">
            {/* AI 메시지 스타일 */}
            <div className="w-[228px] bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2 font-pretendard">
                {aiName}
              </p>
              <p className="text-sm font-pretendard leading-relaxed text-gray-900">
                {m.content}
              </p>
              <div className="text-xs text-gray-500 mt-2 flex gap-2"></div>
            </div>
          </div>
        ) : (
          <div
            key={m.messageId}
            className="flex justify-end  items-end flex-col gap-2"
          >
            {/* 사용자 메시지 스타일 */}
            <div className="flex items-center gap-1.5">
              {/* 에러 토글 버튼 */}
              <button
                onClick={() => handleFeedback(m.messageId)}
                className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span className="text-red-500 text-xs font-bold leading-none">
                  i
                </span>
              </button>

              {/* 사용자 메시지 박스 */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-red-500 max-w-[228px] z-20">
                <p className="text-sm font-pretendard leading-relaxed text-black">
                  {m.content}
                </p>
                <div className="text-xs text-gray-500 mt-2 flex gap-2 justify-end flex-col">
                  <button
                    onClick={() => handleHonorific(m.messageId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-pretendard transition-colors"
                  >
                    존댓말
                  </button>
                </div>
              </div>
            </div>

            {/* 오류 메시지 */}
            {openErrorId === m.messageId && (
              <div className="p-4 bg-gray-600 rounded-xl shadow-sm -mt-6">
                <p className="text-white font-pretendard text-sm">
                  {feedbacks[m.messageId]?.appropriateExpression}
                </p>
                <p className="text-white font-pretendard text-sm">
                  {feedbacks[m.messageId]?.explain}
                </p>
              </div>
            )}

            {/* 존댓말 슬라이더 */}
            {openHonorificId === m.messageId && (
              <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3 w-full">
                <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">
                  Formality Level
                </h3>
                <input
                  type="range"
                  min={0}
                  max={2}
                  value={sliderValue}
                  onChange={(e: { target: { value: any } }) =>
                    setSliderValue(Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
