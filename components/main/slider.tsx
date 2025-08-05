"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function HonorificSlider() {
  const [level, setLevel] = useState(1);
  const max = 4;
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
    <div className="w-[335px] p-4 bg-gray-500 rounded-2xl mb-5">
      <p className="text-white mb-2">Today’s honorific expression</p>
      <div className="bg-white rounded-2xl h-10 flex items-center justify-center mb-4">
        <span className="text-sm text-gray-800">{exampleSentence}</span>
      </div>
      <p className="text-white mb-2">Slide to raise your speech level</p>
      <div
        ref={trackRef}
        className="relative h-3 bg-gray-300 rounded-full"
      >
        <motion.div
          className="absolute h-full bg-black rounded-full"
          animate={{ width: thumbPos }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.div
          className="absolute top-[-6px] w-6 h-6 bg-white border border-black rounded-full shadow"
          animate={{ x: thumbPos - 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
      <input
        type="range"
        min="1"
        max={max}
        step="1"
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="w-full mt-3 opacity-0 h-0"
      />
    </div>
  );
}
