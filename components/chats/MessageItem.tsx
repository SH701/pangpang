/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { MyAI } from "@/lib/types";
import HonorificSlider, { HonorificResults } from "./HonorificSlider";
import { useAuth } from "@/lib/UserContext";

type MessageItemProps = {
  m: any;
  myAI: MyAI | null;
  isMine: boolean;
  isFeedbackOpen: boolean;
  feedbackOpenId: string | null;
  honorificResults: Record<string, Record<number, HonorificResults>>;
  sliderValues: Record<string, number>;
  handleFeedbacks: (messageId: string) => void;
  handleHonorific: (
    messageId: string,
    content: string,
    aiRole?: string
  ) => Promise<void>;
  setSliderValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  messageStatus?: "default" | "error";
};

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
  messageStatus = "default",
}: MessageItemProps) {
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<
    Record<string, boolean>
  >({});
  const [translated, setTranslated] = useState<string | null>(null);
  const [loadingTranslate, setLoadingTranslate] = useState<
    Record<string, boolean>
  >({});
  const [loadingTTs, setLoadingTTS] = useState<Record<string, boolean>>({});
  const { accessToken } = useAuth();
  const showFeedbackButton =
    isMine &&
    (m.politenessScore ?? -1) >= 0 &&
    (m.naturalnessScore ?? -1) >= 0 &&
    (m.politenessScore + m.naturalnessScore) / 2 <= 80;

  const handleClick = async () => {
    setLoading((prev) => ({ ...prev, [m.messageId]: true }));
    await handleHonorific(m.messageId, m.content, myAI?.aiRole);
    setLoading((prev) => ({ ...prev, [m.messageId]: false }));
  };
  const handleFeedbackClick = async () => {
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: true }));
    await handleFeedbacks(m.messageId);
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: false }));
  };

  const handleTranslate = async (messageId: string) => {
    try {
      if (translated) {
        setTranslated(null);
        return;
      }
      setLoading((prev) => ({ ...prev, [messageId]: true }));

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
      setLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };
  const handleTranslateClick = async (messageId: string) => {
    setLoadingTranslate((prev) => ({ ...prev, [messageId]: true }));
    try {
      await handleTranslate(messageId);
    } finally {
      setLoadingTranslate((prev) => ({ ...prev, [messageId]: false }));
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
  const handleTTsClick = async (messageId: string) => {
    setLoadingTTS((prev) => ({ ...prev, [messageId]: true }));
    try {
      await handleTTS(messageId);
    } finally {
      setLoadingTTS((prev) => ({ ...prev, [messageId]: false }));
    }
  };
  const isLastMessage = m.messageId === m[m.length]?.messageId;

  return (
    <div
      className={`flex mb-4 ${
        isMine ? "justify-center items-start" : "items-start justify-start"
      } ${isLastMessage ? "pb-30" : ""} gap-2`}
    >
      {/* 상대방 프로필 */}
      {!isMine && (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-gray-200">
          {myAI?.profileImageUrl ? (
            <Image
              src={myAI.profileImageUrl}
              alt={myAI?.name ?? "AI Avatar"}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      )}

      {/* i 버튼 (내 메시지일 때만) */}
      {showFeedbackButton && (
        <button
          onClick={handleFeedbackClick}
          disabled={loadingFeedbacks[m.messageId]}
          className="w-[18px] h-[18px] border-2 border-red-500 rounded-full 
       flex items-center justify-center shadow-sm flex-shrink-0 ml-13 mt-12
       bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
        >
          {loadingFeedbacks[m.messageId] ? (
            <svg
              className="animate-spin w-3 h-3 text-gray-600"
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
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <span className="text-red-500 text-xs font-bold leading-none">
              i
            </span>
          )}
        </button>
      )}

      {/* 메시지 + 부가 박스 */}
      <div className={`max-w-[75%] flex-1 ${isMine ? "ml-auto" : ""}`}>
        <div className="text-sm font-medium text-gray-600 mb-1 font-pretendard">
          {isMine ? "" : myAI?.name ?? "AI"}
        </div>

        {/* 메시지 풍선 */}
        <div
          className={`relative z-30 p-3 sm:p-4 rounded-2xl border shadow-sm w-full
       ${
         isMine
           ? messageStatus === "error"
             ? "border-red-500 bg-white"
             : showFeedbackButton && m.feedback
             ? "border-red-500 bg-white"
             : showFeedbackButton
             ? "border-red-500 bg-white" // 🔥 평균 점수 낮으면 강조
             : "bg-white text-black border-gray-200"
           : "bg-gray-50 border-gray-200"
       }`}
          data-message-id={m.messageId}
          data-message-status={messageStatus}
        >
          <div className="flex flex-col gap-3">
            <div className="whitespace-pre-wrap py-2 flex-1 text-black text-sm font-normal leading-[130%] border-b border-gray-200">
              <p className="my-2">{m.content}</p>
            </div>

            {/* 번역/tts 버튼 (상대 메시지일 때만) */}
            {!isMine && (
              <div className="flex justify-between gap-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTTsClick(m.messageId)}
                    disabled={loadingTTs[m.messageId]}
                    className="cursor-pointer flex items-center justify-center w-6 h-6"
                  >
                    {loadingTTs[m.messageId] ? (
                      <svg
                        className="animate-spin h-4 w-4 text-gray-600"
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
                    ) : (
                      <Image
                        src="/etc/volume_up.svg"
                        alt="tts"
                        width={20}
                        height={20}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => handleTranslateClick(m.messageId)}
                    disabled={loadingTranslate[m.messageId]}
                    className="cursor-pointer flex items-center justify-cente h-[32px] rounded-2xl"
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
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700 flex-shrink-0 font-pretendard transition-colors"
                  onClick={handleClick}
                >
                  Honorific Slider
                </button>
              </div>
            )}

            {/* 존댓말 버튼 (내 메시지일 때만) */}
            {isMine && (
              <div className="flex items-end justify-end gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700 flex-shrink-0 font-pretendard transition-colors"
                  onClick={handleClick}
                >
                  Honorific Slider
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 피드백 박스 */}
        {isMine && isFeedbackOpen && m.feedback && (
          <div className="p-4 bg-gray-600 rounded-xl shadow-sm -mt-6 w-full">
            <div className="text-white font-pretendard text-sm pb-2 border-b border-gray-400 pt-4">
              {m.feedback.appropriateExpression}
            </div>
            <div className="text-gray-200 font-pretendard text-sm pt-2">
              {m.feedback.explain}
            </div>
          </div>
        )}

        {/* 번역 결과 */}
        {translated && (
          <div className="px-3 pb-3  pt-7 bg-gray-600 rounded-xl shadow-sm -mt-6 -z-10 w-full">
            <p className="text-gray-200 font-pretendard text-sm">
              {translated}
            </p>
          </div>
        )}

        {/* 에러 메시지 */}
        {isMine && messageStatus === "error" && isErrorOpen && (
          <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">
              Error Details
            </h3>
            <p className="text-white font-pretendard text-sm">
              This message contains an error that needs attention.
            </p>
          </div>
        )}

        {/* 존댓말 로딩 */}
        {loading[m.messageId] && (
          <div className="-mt-6 p-3 rounded-2xl bg-gray-600 text-white text-sm flex items-center gap-2 w-full">
            <div className="pt-6 flex gap-3">
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
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        )}

        {/* 존댓말 결과 */}
        {honorificResults[m.messageId] && !loading[m.messageId] && (
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
  );
}
