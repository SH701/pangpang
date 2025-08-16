/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import HelperSlider from "@/components/etc/helperslider";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/UserContext";

export default function HonorificHelper() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [loading,setLoading] = useState(false)
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [explain, setExplain] = useState("");
  const [allResults, setAllResults] = useState<any>(null);

  // formality, intimacy 상태
  const [formality, setFormality] = useState<
    "lowFormality" | "mediumFormality" | "highFormality"
  >("mediumFormality");

  const [intimacy, setIntimacy] = useState<
    "lowIntimacyExpressions" | "mediumIntimacyExpressions" | "highIntimacyExpressions"
  >("mediumIntimacyExpressions");

  // API 호출
  const handleTranslate = async () => {
    try {
      setLoading(true);        
      setExplain("");    
      const res = await fetch(
        `/api/language/honorific-variations?sourceContent=${encodeURIComponent(source)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      setAllResults(data); // 전체 결과 저장
      setExplain(data.explain);

      // ✅ 현재 슬라이더 값에 맞춰 result 설정
      const selected = data[intimacy]?.[formality] ?? "변환 결과 없음";
      setResult(selected);
    } catch (e) {
      console.error(e);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="p-6 rounded-lg max-w-lg mx-auto mt-6 flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex items-center mb-6 px-4">
        <ChevronLeftIcon
          onClick={() => router.push("/main")}
          className="w-6 h-6 text-blue-500 cursor-pointer"
        />
        <h1 className="text-xl font-semibold ml-4">Honorific helper</h1>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white rounded-2xl py-4 px-2 flex flex-col flex-1 mx-6 border border-gray-300">
        <textarea
          className="text-xl placeholder:text-gray-400 resize-none w-full h-40"
          placeholder="Type in English..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // 줄바꿈 막기
              handleTranslate();  // 변환 실행
            }
          }}
        />

        {/* 슬라이더 → intimacy + formality 전달 */}
        <HelperSlider
          onChange={(i, f) => {
            setIntimacy(i);
            setFormality(f);

            // ✅ API 응답이 있으면 선택값에 맞춰서 result 즉시 변경
            if (allResults) {
              const selected = allResults[i]?.[f] ?? "결과 없음";
              setResult(selected);
            }
          }}
        />

        {/* 출력 영역 */}
        <div className="mt-3 pt-3 border-t border-gray-300">
          <textarea
            className="text-xl font-semibold placeholder:text-gray-400 resize-none w-full h-20"
            placeholder="Korean translation..."
            value={result}
            readOnly
          />
        </div>
      </div>

      {/* Noonchi Coach */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6 mx-4">
  <div className="flex gap-2 items-center">
    <Image src="/circle/circle4.png" alt="circle" width={28} height={28} />
    <h3 className="font-semibold text-blue-600">Noonchi Coach</h3>
  </div>

  {/* 상태별 출력 */}
  {loading ? (
    <div className="flex items-center gap-2 mt-2 text-gray-500">
      {/* spinner */}
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
    <p className="text-sm mt-2">{explain}</p>
  ) : (
    <p className="text-sm mt-2 text-gray-400">
     The conversion has not been run yet.
    </p>
  )}
</div>
    </div>
  );
}
