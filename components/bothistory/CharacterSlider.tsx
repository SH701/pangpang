'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
  const [open, setOpen] = useState(false);

  const visibleCount = 3;
  const itemWidth = 40;
  const dragLimit = -((characters.length - visibleCount) * itemWidth + itemWidth / 2);

  return (
    <>
      <div className="w-full px-4 py-2 mx-4 mt-8 ">
        <div ref={containerRef} className="overflow-hidden w-[330px]">
          <motion.div
            className="flex space-x-3 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: dragLimit, right: 0 }}
            transition={{ type: 'spring', bounce: 0.2 }}
          >
            {characters.map((c, i) =>
              c.isAdd ? (
                <button
                  key={i}
                  onClick={() => setOpen(true)}
                  className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl shrink-0"
                >
                  +
                </button>
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

      {/* Action Sheet */}
      {open && (
  <div
    className="fixed inset-0 z-50 bg-black/40 flex items-end h-full"
    onClick={(e) => {
      if (e.target === e.currentTarget) setOpen(false);
    }}
  >
    <div className="w-full bg-white rounded-t-2xl pt-4 pb-[calc(env(safe-area-inset-bottom,20px)+20px)] px-4">
      <button className="w-full flex justify-between items-center py-4 text-base font-medium">
        Start New Chat <span>{'>'}</span>
      </button>
      <button className="w-full flex justify-between items-center py-4 text-base font-medium">
        View Settings <span>{'>'}</span>
      </button>
      <button
        onClick={() => setOpen(false)}
        className="mt-4 w-full py-3 text-center text-gray-500 text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </>
  );
}
