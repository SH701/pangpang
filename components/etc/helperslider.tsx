"use client"

import { useState } from "react";

export default function HelperSlider(){
     const steps = ['Familiar', '', '', '', 'Polite'] as const;
      const max = steps.length - 1;
      const [level, setLevel] = useState(0);
      const percent = (level / max) * 100;
    return (
        <>
        <div className="relative h-2 mb-4">
        <div className="absolute inset-0 bg-gray-200 rounded-full" />
        {steps.map((_, i) => (
          <div
            key={i}
            className={`absolute top-1/2 z-10 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-colors ${
              i <= level ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
            }`}
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
          onChange={(e) => setLevel(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Speech level"
        />
      </div>
      <div className="flex justify-between text-[11px] text-gray-600">
        {steps.map((label, i) => (
          <span
            key={i}
            className={`flex-1 ${i === 0 ? 'text-left' : i === steps.length - 1 ? 'text-right' : 'text-center'}`}
          >
            {label}
          </span>
        ))}
      </div>
      </>
    )
}