"use client";

import HelperSlider from "@/components/etc/helperslider";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image"

export default function HonorificHelper() {
 
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[375px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => router.push("/main")}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold font-pretendard text-gray-800">Honorific helper</h1>
        <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 py-6">
        {/* 영어 입력 및 변환 컨테이너 */}
        <div className="w-[335px] min-h-[495px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white mx-auto mb-6 p-6">
          {/* 영어 입력 부분 */}
          <div className="mb-6">
            <div className="h-32 bg-white rounded-xl flex items-start justify-between">
              <p className="text-[#9CA3AF] font-pretendard text-base font-normal leading-none">영어 텍스트를 입력하세요</p>
              <button className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* 한국말 부분 */}
          <div className="mb-6">
            <div className="h-32 bg-white rounded-xl flex items-start justify-start">
              <p className="text-[#374151] font-pretendard text-xl font-semibold leading-none">존댓말 수준에 따른 한국어 변환 결과</p>
            </div>
          </div>

          {/* Helper Slider */}
          <div>
            <HelperSlider />
          </div>
        </div>

        {/* Noonchi Coach 안내 박스 */}
        <div className="w-[335px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white mx-auto">
          <div className="flex items-center gap-3 p-6">
            <Image 
              src="/circle/circle4.png" 
              alt="Noonchi Coach" 
              width={20} 
              height={20}
              className="rounded-full"
            />
            <h3 className="text-[#111827] font-pretendard text-base font-semibold leading-[130%]">Noonchi Coach</h3>
          </div>
          
          {/* 구분선 */}
          <div className="border-t border-gray-200 mx-6 mb-6"></div>
          
          <div className="space-y-3 px-6 pb-6">
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <p className="text-sm font-pretendard text-gray-700 mb-2">
                <span className="font-semibold text-blue-600">To your boss:</span>
              </p>
              <p className="text-sm font-pretendard text-gray-800">
                Did you eat? → <span className="font-semibold text-blue-600">점심 식사하셨나요?</span>
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <p className="text-sm font-pretendard text-gray-700 mb-2">
                <span className="font-semibold text-blue-600">To your parents:</span>
              </p>
              <p className="text-sm font-pretendard text-gray-800">
                <span className="font-semibold text-blue-600">밥 먹었어요?</span> (polite yet warm)
              </p>
            </div>
            
            <p className="text-sm font-pretendard text-gray-600 text-center pt-2">
              Keep it short and adapt politely to the situation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
