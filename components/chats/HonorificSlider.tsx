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
    <div className="mt-2 p-3 bg-gray-100 rounded-xl">
      <p className="mb-2">{mapped[value]}</p>
      <input
        type="range"
        min={0}
        max={2} 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-[8px] text-gray-500">
        <span>Familiar</span>
        <span>Highly Polite</span>
      </div>
    </div>
  )
}
