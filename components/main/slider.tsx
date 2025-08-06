"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function HonorificSlider() {
  const [level, setLevel] = useState(1);
  const max = 3;
  const exampleSentence = "식사 맛있게 드세요.";
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.offsetWidth);
    }
  }, []);
  const thumbPos = trackWidth
    ? ((level - 1) / (max - 1)) * trackWidth
    : 0;

  return (
    <div className="w-[335px] pt-4  shadow-lg rounded-2xl mb-5">
      <p className="text-black font-semibold mb-2 text-center">Today’s honorific expression</p>
      <div className="bg-white rounded-2xl h-10 flex items-center justify-center">
        <span className="text-sm text-gray-800">{exampleSentence}</span>
      </div>
     <div className="w-full max-w-md mx-auto bg-blue-50 p-4 rounded-xl flex-col">
      <h2 className="text-center font-medium text-gray-800 mb-4">
        Slide to raise your speech level
      </h2>
      <div ref={trackRef} className="relative h-3 bg-blue-200 rounded-full">
        <motion.div
          className="absolute h-full bg-blue-600 rounded-full"
          animate={{ width: thumbPos }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
        <motion.div
          className="absolute top-[-6px] w-6 h-6 bg-white border border-blue-700 rounded-full shadow"
          animate={{ x: thumbPos - 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>
      <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="w-full opacity-0 h-0"
      />
      <div className="flex justify-between text-sm text-gray-700 -mt-3">
        <div className="text-center w-[60px]">
          <div>0</div>
          <div className="text-xs text-gray-500">Friendly</div>
        </div>
        <div className="text-center w-[60px]">
          <div>50</div>
          <div className="text-xs text-gray-500">Casual</div>
        </div>
        <div className="text-center w-[60px]">
          <div>100</div>
          <div className="text-xs text-gray-500">Formal</div>
        </div>
      </div>
    </div>
    </div>
  );
}
