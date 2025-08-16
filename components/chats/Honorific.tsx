'use client'

type HonorificSliderProps = {
  results: Record<number, string>
  value: number
  onChange: (newValue: number) => void
}

export default function HonorificSlider({ results, value, onChange }: HonorificSliderProps) {
  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
      <p className="mb-2 font-pretendard text-gray-900">{results[value]}</p>
      <input
        type="range"
        min={0}
        max={4}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 font-pretendard">
        <span>Familiar</span>
        <span>Highly Polite</span>
      </div>
    </div>
  )
}
