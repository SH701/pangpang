/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/UserContext";
import { useState } from "react";
import Image from "next/image";

type ChatMsg = {
  messageId: number;
  role: "USER" | "AI";
  content: string;
  feedback?: string;
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
  const [sliderValue, setSliderValue] = useState(1);
  const [translated, setTranslated] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<number, { explain: string; appropriateExpression: string }>
  >({});
  const [open, setOpen] = useState<number | null>(null);
  const [openHonorific, setOpenHonorific] = useState<number | null>(null);

  // 로딩 상태
  const [loadingTranslate, setLoadingTranslate] = useState<
    Record<number, boolean>
  >({});
  const [loadingTTs, setLoadingTTs] = useState<Record<number, boolean>>({});
  const [loadingHonorific, setLoadingHonorific] = useState<
    Record<number, boolean>
  >({});
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<
    Record<number, boolean>
  >({});

  const handleFeedback = async (messageId: number) => {
    try {
      setLoadingFeedbacks((prev) => ({ ...prev, [messageId]: true }));
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        throw new Error(`Feedback API failed: ${res.status}`);
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
      console.error("피드백 처리 중 오류:", error);
    } finally {
      setLoadingFeedbacks((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleHonorific = async (messageId: number) => {
    try {
      setLoadingHonorific((prev) => ({ ...prev, [messageId]: true }));
      const res = await fetch(
        `/api/messages/${messageId}/honorific-variations`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) throw new Error(`Honorific API failed: ${res.status}`);
      const data = await res.json();
      console.log("존댓말 변환 완료:", data);
    } catch (error) {
      console.error("존댓말 처리 오류:", error);
    } finally {
      setLoadingHonorific((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleTranslate = async (messageId: number) => {
    try {
      if (translated) {
        setTranslated(null);
        return;
      }
      setLoadingTranslate((prev) => ({ ...prev, [messageId]: true }));
      const res = await fetch(`/api/messages/${messageId}/translate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error(`Translation API failed: ${res.status}`);
      const data = await res.text();
      setTranslated(data);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setLoadingTranslate((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleTTS = async (messageId: number) => {
    try {
      setLoadingTTs((prev) => ({ ...prev, [messageId]: true }));
      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
        },
      });
      if (!res.ok) throw new Error(`TTS 요청 실패: ${res.status}`);
      const audioUrl = await res.text();
      new Audio(audioUrl).play();
    } catch (err) {
      console.error("handleTTS error:", err);
    } finally {
      setLoadingTTs((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((m) =>
        m.role === "AI" ? (
          <div key={m.messageId} className="flex flex-col justify-start gap-4">
            <div className="w-[240px] bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 z-20">
              <p className="text-xs font-semibold text-gray-600 mb-2 font-pretendard">
                {aiName}
              </p>
              <p className="text-sm font-pretendard leading-relaxed text-gray-900">
                {m.content}
              </p>

              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-2">
                  {/* TTS 버튼 */}
                  <button
                    onClick={() => handleTTS(m.messageId)}
                    disabled={loadingTTs[m.messageId]}
                    className="cursor-pointer flex items-center justify-center w-6 h-6"
                  >
                    {loadingTTs[m.messageId] ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Image
                        src="/etc/volume_up.svg"
                        alt="tts"
                        width={20}
                        height={20}
                      />
                    )}
                  </button>

                  {/* 번역 버튼 */}
                  <button
                    onClick={() => handleTranslate(m.messageId)}
                    disabled={loadingTranslate[m.messageId]}
                    className="cursor-pointer flex items-center justify-center w-6 h-6"
                  >
                    {loadingTranslate[m.messageId] ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Image
                        src="/etc/language.svg"
                        alt="translate"
                        width={20}
                        height={20}
                      />
                    )}
                  </button>
                </div>

                {/* 존댓말 버튼 */}
                <button
                  onClick={() => {
                    handleHonorific(m.messageId);
                    setOpenHonorific((prev) =>
                      prev === m.messageId ? null : m.messageId
                    );
                  }}
                  disabled={loadingHonorific[m.messageId]}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center"
                >
                  {loadingHonorific[m.messageId] ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    "Honorific"
                  )}
                </button>
              </div>
            </div>

            {/* 번역 결과 */}
            {translated && (
              <div className="p-3 bg-gray-600 rounded-b-xl shadow-sm -mt-2">
                <p className="text-white text-sm">{translated}</p>
              </div>
            )}

            {/* 존댓말 슬라이더 */}
            {openHonorific === m.messageId && (
              <div className="bg-gray-600 rounded-b-xl shadow-sm -mt-2 p-3">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Formality Level
                </h3>
                <input
                  type="range"
                  min={0}
                  max={2}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        ) : (
          <div key={m.messageId} className="flex flex-col w-full">
            <div className="flex gap-2 w-full ml-24 mt-3 max-w-[240px]">
              {/* 피드백 버튼 */}
              <button
                onClick={() => {
                  handleFeedback(m.messageId);
                  setOpen((prev) =>
                    prev === m.messageId ? null : m.messageId
                  );
                }}
                disabled={loadingFeedbacks[m.messageId]}
                className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center bg-transparent hover:bg-red-50"
              >
                {loadingFeedbacks[m.messageId] ? (
                  <div className="animate-spin h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full"></div>
                ) : (
                  <span className="text-red-500 text-xs font-bold">i</span>
                )}
              </button>

              <div className="flex flex-col w-full max-w-[220px]">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-red-500 relative">
                  <p className="text-sm font-pretendard leading-relaxed text-black pb-3 border-b border-gray-400">
                    {m.content}
                  </p>
                </div>

                {/* 피드백 결과 */}
                {open === m.messageId && (
                  <div className="p-4 bg-gray-600 rounded-b-xl shadow-sm -mt-2">
                    <div className="text-white text-sm pb-2 border-b border-gray-400">
                      {feedbacks[m.messageId]?.appropriateExpression}
                    </div>
                    <div className="text-gray-200 text-sm pt-2">
                      {feedbacks[m.messageId]?.explain}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
