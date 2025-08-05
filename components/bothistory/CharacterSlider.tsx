'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const characters = [
  { name: '+', isAdd: true },
  { name: 'Boss' },
  { name: 'Minji' },
  { name: 'Cafe' },
  { name: 'Friend' },
  { name: 'Hyunwoo' },
  { name: 'Nana' },
];

export default function CharacterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = 3;
  const itemWidth = 40; // w-14 + gap
  const dragLimit = -((characters.length - visibleCount) * itemWidth + itemWidth / 2);

  return (
    <div className="w-full px-4 py-2">
      <div ref={containerRef} className="overflow-hidden w-[300px]">
        <motion.div
          className="flex space-x-3 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: dragLimit, right: 0 }}
          transition={{ type: 'spring', bounce: 0.2 }}
        >
          {characters.map((c, i) =>
            c.isAdd ? (
              <Link
                key={i}
                href="/add/chat"
                className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl shrink-0"
              >
                +
              </Link>
            ) : (
              <div
                key={i}
                className="flex flex-col items-center shrink-0 w-14"
              >
                <div className="w-14 h-14 rounded-full bg-gray-300" />
                <span className="text-sm text-center">{c.name}</span>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}
