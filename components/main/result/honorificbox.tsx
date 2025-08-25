/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

type HonorificBoxProps = {
  messageId: number;
  honorificResults: Record<string, any>;
  sliderValue: Record<string, number>;
  setSliderValue: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  className?: string; // ✅ 선택적
};

const formalityMap = ["lowFormality", "mediumFormality", "highFormality"];

export default function HonorificBox({
  messageId,
  honorificResults,
  sliderValue,
  setSliderValue,
  className = "",
}: HonorificBoxProps) {
  const value = sliderValue[messageId] ?? 1;
  const resultText = honorificResults[messageId]
    ? honorificResults[messageId][formalityMap[value]]
    : "Loading...";

  return (
    <div
      className={`bg-gray-600 rounded-b-xl shadow-sm -mt-4 px-3 pt-5 pb-3 max-w-[240px] ${className}`}
    >
      {/* 결과 문장 */}
      <h3 className="text-sm font-semibold text-white mb-3 font-pretendard">
        {resultText}
      </h3>

      {/* 슬라이더 */}
      <input
        type="range"
        min={0}
        max={2}
        value={value}
        onChange={(e) =>
          setSliderValue((prev) => ({
            ...prev,
            [messageId]: Number(e.target.value),
          }))
        }
        className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
            value * 50
          }%, #6B7280 ${value * 50}%, #6B7280 100%)`,
        }}
      />

      {/* 라벨 */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
            <svg
              className="w-2 h-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <span className="text-xs text-white font-pretendard">Casual</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white font-pretendard">Official</span>
          <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
            <svg
              className="w-2 h-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
