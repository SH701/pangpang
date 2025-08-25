/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/UserContext";
import { useState } from "react";
import Image from "next/image";
import HonorificBox from "./honorificbox";

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
  const [sliderValue, setSliderValue] = useState<Record<string, number>>({});
  const [translated, setTranslated] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<number, { explain: string; appropriateExpression: string }>
  >({});
  const [open, setOpen] = useState<number | null>(null);
  const [openHonoricif, setOpenHonorific] = useState<number | null>(null);
  const [honorificResults, setHonorificResults] = useState<Record<string, any>>(
    {}
  );

  const handleFeedback = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Feedback API failed: ${res.status} - ${errorText}`);
      }

      const feedbackData = await res.json();

      setFeedbacks((prev) => ({
        ...prev,
        [Number(messageId)]: {
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
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Honorific API failed: ${res.status}`);
      }

      const data = await res.json();
      setHonorificResults((prev) => ({
        ...prev,
        [messageId]: data,
      }));
      setSliderValue((prev) => ({
        ...prev,
        [messageId]: 1,
      }));
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
    }
  };

  const handleTTS = async (messageId: string) => {
    try {
      if (!messageId) return;

      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  const showFeedbackButton = (m: ChatMsg) => {
    if (m.role !== "USER") return false;
    if (
      m.politenessScore === undefined ||
      m.naturalnessScore === undefined ||
      m.politenessScore < 0 ||
      m.naturalnessScore < 0
    ) {
      return false;
    }
    const avg = (m.politenessScore + m.naturalnessScore) / 2;
    return avg <= 80;
  };
  return (
    <div className="space-y-4">
      {messages.map((m) =>
        m.role === "AI" ? (
          <div key={m.messageId} className="flex flex-col justify-start gap-4">
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
              <div className="p-4 bg-gray-600 shadow-sm w-[240px] rounded-b-xl -mt-6">
                <p className="text-gray-200 font-pretendard text-sm leading-relaxed">
                  {translated}
                </p>
              </div>
            )}
            {openHonoricif === m.messageId && (
              <HonorificBox
                messageId={m.messageId}
                honorificResults={honorificResults}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                className="-mt-7"
              />
            )}
          </div>
        ) : (
          <div key={m.messageId} className="flex flex-col w-full ">
            <div className="flex justify-end w-full mt-3">
              <div className="flex gap-2 w-60">
                <div
                  className="w-[18px] flex items-center justify-center flex-shrink-0"
                  style={{ height: "74px" }}
                >
                  {showFeedbackButton(m) && (
                    <button
                      onClick={() => {
                        handleFeedback(String(m.messageId));
                        setOpen((prev) =>
                          prev === m.messageId ? null : m.messageId
                        );
                      }}
                      className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <span className="text-red-500 text-xs font-bold leading-none">
                        i
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div
                    className={`bg-white p-3 rounded-xl shadow-sm border z-30 ${
                      showFeedbackButton(m)
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="text-sm font-pretendard leading-relaxed text-black pb-3 border-b border-gray-400">
                      {m.content}
                    </p>

                    {/* Honorific Slider 버튼 */}
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
                    <div className="p-4 bg-gray-600 rounded-b-xl shadow-sm -mt-6">
                      <div className="text-white font-pretendard text-sm pb-2 border-b border-gray-400 pt-4">
                        {feedbacks[m.messageId]?.appropriateExpression}
                      </div>
                      <div className="text-gray-200 font-pretendard text-sm pt-2">
                        {feedbacks[m.messageId]?.explain}
                      </div>
                    </div>
                  )}

                  {/* 존댓말 슬라이더 */}
                  {openHonoricif === m.messageId && (
                    <HonorificBox
                      messageId={m.messageId}
                      honorificResults={honorificResults}
                      sliderValue={sliderValue}
                      setSliderValue={setSliderValue}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
