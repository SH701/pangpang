'use client'

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export default function Slider() {
  const steps = [
    'Familiar','','','',
    'Highly Polite',
  ]
  const max = steps.length - 1
  const [level, setLevel] = useState(0)
  const percent = (level / max) * 100
  const stops = steps.length

  return (
    <div className='w-[335px] flex flex-col justify-center items-center rounded-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] mb-6'>
      <span className='font-semibold text-lg py-2 px-4 mt-3'>Today`s honorific expression</span>
      <span className='w-[296px] bg-gray-200 text-center py-2 my-2 mb-6 rounded-xl'>문장</span>
    <div className="w-[335px] px-4 max-w-md mx-auto border rounded-xl border-blue-400">
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center bg-white px-3 py-1 text-xs text-gray-600 rounded-full shadow">
          <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-600" />
          Choose your speech level
        </span>
      </div>
      <div className="relative h-2 mb-6">
        <div className="absolute inset-0 bg-gray-200 rounded-full" />
      {Array.from({ length: stops }).map((_, i) => (
          <div
            key={i}
            className={`
              absolute top-1/2 z-10
              w-3 h-3 rounded-full border-2
              transform -translate-x-1/2 -translate-y-1/2
              transition-colors
              ${i <= level 
                ? 'bg-blue-600 border-blue-600' 
                : 'bg-white border-gray-300'}
            `}
            style={{ left: `${(i / max) * 100}%` }}
          />
        ))}
  
        <div
          className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
          style={{ left: `${percent}%` }}
        >
          <div className="w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow -translate-x-1/2" />
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={level}
          onChange={e => setLevel(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        {steps.map((label, i) => (
          <span
            key={i}
            className={`flex-1 ${
              i === 0
                ? 'text-left'
                : i === steps.length - 1
                ? 'text-right'
                : 'text-center'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
    </div>
  )
}
