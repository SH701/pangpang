'use client';

import { useState } from 'react';

export default function Transcript({ aiMsg, userMsg }: { aiMsg: string; userMsg: string }) {
  const [isHonorificOpen, setIsHonorificOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleHonorificClick = () => {
    setIsHonorificOpen(!isHonorificOpen);
  };

  // 존댓말 결과 데이터 (채팅창과 동일한 형식)
  const honorificResults: Record<number, string> = {
    0: "네 맞는데 왜요.",
    1: "네 맞는데 왜요?",
    2: "네 맞는데 왜요?",
    3: "네 맞는데 왜요?",
    4: "네 맞는데 왜요?"
  };

  return (
    <div className="space-y-4">
      {/* AI */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2 font-pretendard">사장님</p>
        <div className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 max-w-[228px]">
          <p className="text-sm font-pretendard leading-relaxed text-gray-900">{aiMsg}</p>
          <div className="text-xs text-gray-500 mt-2 flex gap-2">
            <span>🔊</span>
            <span>🌐</span>
            <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">존댓말</span>
          </div>
        </div>
      </div>

      {/* 사용자 - 오류 상태 */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1.5">
          {/* 오류 상태일 때 좌측에 분리된 투명한 빨간 원형 정보 아이콘 */}
          <button
            onClick={() => setIsErrorOpen(!isErrorOpen)}
            className="w-[18px] h-[18px] border-2 border-red-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-transparent hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="text-red-500 text-xs font-bold leading-none">i</span>
          </button>
          
          <div className="bg-white p-3 rounded-xl shadow-sm border border-red-500 max-w-[228px]">
            <p className="text-sm font-pretendard leading-relaxed text-black">{userMsg}</p>
            <div className="text-xs text-gray-500 mt-2 flex gap-2 justify-end">
              <button
                onClick={handleHonorificClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-pretendard transition-colors"
              >
                존댓말
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 - 슬라이더 말풍선과 동일한 스타일 */}
      {isErrorOpen && (
        <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3">
          <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">Error Details</h3>
          <p className="text-white font-pretendard text-sm">This message contains an error that needs attention.</p>
        </div>
      )}

      {/* 존댓말 드롭다운 - 채팅창과 동일한 스타일 */}
      {isHonorificOpen && (
        <div className="p-4 bg-gray-600 rounded-xl shadow-sm mt-3">
          <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">Formality Level</h3>
          <p className="mb-3 text-white font-pretendard text-sm">{honorificResults[sliderValue]}</p>
          <div className="relative">
            <input
              type="range"
              min={0}
              max={2}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer slider-blue"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${sliderValue * 50}%, #6B7280 ${sliderValue * 50}%, #6B7280 100%)`
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <span className="text-xs text-white font-pretendard">Casual</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-white font-pretendard">Official</span>
                <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}