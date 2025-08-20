/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/UserContext";
import { useState } from "react";
import Image from "next/image";

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
  const [sliderValue, setSliderValue] = useState(1);
  const [translated, setTranslated] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<number, { explain: string; appropriateExpression: string }>
  >({});
  const [open, setOpen] = useState<number | null>(null);
  const [openHonoricif, setOpenHonorific] = useState<number | null>(null);

  const handleFeedback = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST", // 피드백을 생성하는 방식이 POST일 경우
        headers: {
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

  const handleHonorific = async (messageId: string) => {
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

  const handleTranslate = async (messageId: string) => {
    try {
      if (translated) {
        setTranslated(null);
        return;
      }

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
    }
  };

  const handleTTS = async (messageId: string) => {
    try {
      if (!messageId) return; // ✅ messageId 없으면 실행 안 함

      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
        },
      });

      if (!res.ok) {
        throw new Error(`TTS 요청 실패: ${res.status}`);
      }

      const audioUrl = await res.text();

      const audio = new Audio(audioUrl);
      audio.play();

      return audioUrl;
    } catch (err) {
      console.error("handleTTS error:", err);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {messages.map((m) =>
          m.role === "AI" ? (
            <div
              key={m.messageId}
              className="flex flex-col justify-start gap-4"
            >
              {/* AI 메시지 스타일 */}
              <div className="w-[240px] bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 z-20">
                <p className="text-xs font-semibold text-gray-600 mb-2 font-pretendard">
                  {aiName}
                </p>
                <p className="text-sm font-pretendard leading-relaxed text-gray-900">
                  {m.content}
                </p>
                <div className="text-xs text-gray-500 mt-2 flex gap-2 border-t border-gray-400"></div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => handleTTS(String(m.messageId))}
                      className="cursor-pointer"
                    >
                      <Image
                        src="/etc/volume_up.svg"
                        alt="tts"
                        width={20}
                        height={20}
                      />
                    </button>
                    <button
                      onClick={() => handleTranslate(String(m.messageId))}
                      className="cursor-pointer"
                    >
                      <Image
                        src="/etc/language.svg"
                        alt="translate"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      handleHonorific(String(m.messageId));
                      setOpenHonorific((prev) =>
                        prev === m.messageId ? null : m.messageId
                      );
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 mt-3 rounded text-xs font-pretendard transition-colors"
                  >
                    Honorific Slider
                  </button>
                </div>
              </div>
              {translated && (
                <div
                  className={`p-4 bg-gray-600 shadow-sm w-[240px] -mt-7 ${
                    open === m.messageId
                      ? "rounded-b-xl -mt-2"
                      : "rounded-b-xl -mt-2"
                  }`}
                >
                  <p className="text-gray-200 font-pretendard text-sm leading-relaxed">
                    {translated}
                  </p>
                </div>
              )}
              {openHonoricif === m.messageId && (
                <div className="bg-gray-600 rounded-b-xl shadow-sm -mt-2 p-3">
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
          ) : (
            <div key={m.messageId} className="flex flex-col w-full">
              {/* 사용자 메시지 박스 - 왼쪽 정렬 */}
              <div className="flex  gap-2 w-full ml-24 mt-3 max-w-[240px]">
                <button
                  onClick={() => {
                    handleFeedback(String(m.messageId));
                    setOpen((prev) =>
                      prev === m.messageId ? null : m.messageId
                    );
                  }}
                  className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-transparent hover:bg-red-50 transition-colors cursor-pointer mt-1"
                >
                  <span className="text-red-500 text-xs font-bold leading-none">
                    i
                  </span>
                </button>

                <div className="flex flex-col w-full max-w-[220px]">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-red-500 relative">
                    <p className="text-sm font-pretendard leading-relaxed text-black pb-3 border-b border-gray-400">
                      {m.content}
                    </p>

                    {/* Honorific Slider 버튼을 메시지 박스 내부 우측 하단에 배치 */}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          handleHonorific(String(m.messageId));
                          setOpenHonorific((prev) =>
                            prev === m.messageId ? null : m.messageId
                          );
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 mt-3 rounded text-xs font-pretendard transition-colors"
                      >
                        Honorific Slider
                      </button>
                    </div>
                  </div>

                  {/* 피드백 표시 - 메시지 바로 아래 붙임 */}
                  {open === m.messageId && (
                    <div className="p-4 bg-gray-600 rounded-b-xl shadow-sm -mt-2 pt-4">
                      <div className="text-white font-pretendard text-sm pb-2 border-b border-gray-400">
                        {feedbacks[m.messageId]?.appropriateExpression}
                      </div>
                      <div className="text-gray-200 font-pretendard text-sm pt-2 leading-relaxed">
                        {feedbacks[m.messageId]?.explain}
                      </div>
                    </div>
                  )}

                  {/* 번역 결과 - 피드백 아래 또는 메시지 아래 */}

                  {/* 존댓말 슬라이더 */}
                  {openHonoricif === m.messageId && (
                    <div className="bg-gray-600 rounded-b-xl shadow-sm -mt-2 p-3">
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
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
