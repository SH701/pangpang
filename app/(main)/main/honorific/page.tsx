/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import HelperSlider from "@/components/etc/helperslider";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/UserContext";
import { useRecorder } from "@/hooks/useRecorder";

export default function HonorificHelper() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [explain, setExplain] = useState("");
  const [allResults, setAllResults] = useState<any>(null);
  const { isRecording, startRecording, stopRecording } = useRecorder();

  const [formality, setFormality] = useState<
    "lowFormality" | "mediumFormality" | "highFormality"
  >("mediumFormality");

  const [intimacy, setIntimacy] = useState<
    | "closeIntimacyExpressions"
    | "mediumIntimacyExpressions"
    | "distantIntimacyExpressions"
  >("mediumIntimacyExpressions");
  const [recording, setRecording] = useState(false);
  const handleTranslate = async () => {
    try {
      setLoading(true);
      setExplain("");
      const res = await fetch(
        `/api/language/honorific-variations?sourceContent=${encodeURIComponent(
          source
        )}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      setAllResults(data);
      setExplain(data.explain);

      const selected = data?.[intimacy]?.[formality] ?? "변환 결과 없음";
      setResult(selected);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const handleTTS = async () => {
    try {
      if (!result) return;

      const res = await fetch("/api/language/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text: result }),
      });

      if (!res.ok) throw new Error("TTS 요청 실패");

      const audioUrl = await res.text();

      const audio = new Audio(audioUrl);
      audio.play();

      return audioUrl;
    } catch (e) {
      console.error("TTS 에러:", e);
    }
  };
  const handleSTT = async (url: string) => {
    const res = await fetch("/api/language/stt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ audioUrl: url }),
    });

    if (!res.ok) throw new Error("STT 요청 실패");

    const text = await res.text();
    setSource(text);
  };
  const handleMicClick = async () => {
    if (isRecording) {
      const file = await stopRecording();
      setRecording(false);

      // 1. presigned URL 요청
      const res = await fetch("/api/files/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: "audio.wav",
          fileExtension: "wav",
        }),
      });

      if (!res.ok) throw new Error("presigned-url 요청 실패");
      const { url: presignedUrl } = await res.json();

      // 2. S3 업로드
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/wav" },
        body: file,
      });

      // 3. 최종 URL
      const audioUrl = presignedUrl.split("?")[0];

      // 4. 메시지 전송 (텍스트 없이 오디오만)
      await handleSTT(audioUrl);
    } else {
      startRecording();
      setRecording(true);
    }
  };
  return (
    <div className="h-screen bg-gray-50 flex flex-col w-full overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => router.push("/main")}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold font-pretendard text-gray-800">
          Honorific helper
        </h1>
        <div className="w-10" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 pt-6 ">
        <div className="w-[335px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white mx-auto mb-6 px-6 placeholder:text-gray-400 ">
          {/* 입력 영역 */}
          <div className="mb-3 pt-6 relative">
            {/* textarea */}
            <textarea
              className="resize-none w-full h-22  rounded-md pr-10 font-pretendard focus:ring-0 focus:outline-none placeholder:text-gray-400"
              placeholder="Please enter the polite sentence in English or Korean."
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
              style={{
                color: "#374151",
                fontFamily: "Pretendard",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "normal",
              }}
            />

            {/* 마이크 버튼 (textarea 오른쪽에 오버레이) */}
            <button
              type="button"
              onClick={handleMicClick}
              className="absolute top-5 right-0 text-blue-500 rounded-full bg-blue-200 p-2 cursor-pointer size-9 flex justify-center items-center"
            >
              {recording ? (
                <Image
                  src="/etc/pause.png"
                  alt="pause"
                  width={16}
                  height={16}
                />
              ) : (
                <Image src="/etc/mic.png" alt="mic" width={20} height={20} />
              )}
            </button>

            {/* Submit 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={handleTranslate}
                className="mt-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* 출력 영역 */}
          <div className="mb-3">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500 h-32 justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              <textarea
                className="resize-none w-full h-24 border-none focus:ring-0 focus:outline-none font-pretendard"
                placeholder=""
                value={result}
                readOnly
                style={{
                  color: "var(--Natural-cool-gray-700, #374151)",
                  fontFamily: "Pretendard",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "normal",
                }}
              />
            )}
            <div className="flex justify-end">
              <button onClick={handleTTS} className="cursor-pointer">
                <Image
                  src="/etc/volume_up.svg"
                  alt="sound"
                  width={19}
                  height={19}
                />
              </button>
            </div>
          </div>
          {/* Helper Slider */}
          <HelperSlider
            onChange={(i, f) => {
              setIntimacy(i);
              setFormality(f);
              if (allResults) {
                const selected = allResults[i]?.[f] ?? "결과 없음";
                setResult(selected);
              }
            }}
          />
        </div>

        {/* Noonchi Coach */}
        <div className="w-[335px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white mx-auto">
          <div className="flex items-center gap-3 p-6">
            <Image
              src="/circle/circle4.png"
              alt="Noonchi Coach"
              width={20}
              height={20}
              className="rounded-full"
            />
            <h3 className="text-[#111827] font-pretendard text-base font-semibold leading-[130%]">
              Noonchi Coach
            </h3>
          </div>
          <div className="border-t border-gray-200 mx-6 mb-6"></div>
          <div className="space-y-3 px-6 pb-6">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : explain ? (
              <p className="text-sm text-gray-700">{explain}</p>
            ) : (
              <p className="text-sm text-gray-400">
                The conversion has not been run yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
