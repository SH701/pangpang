'use client'

export type HonorificResults = {
  lowFormality: string
  mediumFormality: string
  highFormality: string
}

type HonorificSliderProps = {
  results: HonorificResults
  value: number
  onChange: (newValue: number) => void
}

export default function HonorificSlider({ results, value, onChange }: HonorificSliderProps) {
  const mapped = [
    results.lowFormality,
    results.mediumFormality,
    results.highFormality,
  ]

  return (
    <div className="honorific-dropdown p-4 bg-gray-600 rounded-xl shadow-sm -mt-6">
      <p className="mb-3 text-white font-pretendard text-sm mt-3">{mapped[value]}</p>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={2}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer slider-blue"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${value * 50}%, #6B7280 ${value * 50}%, #6B7280 100%)`
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
  )
}
