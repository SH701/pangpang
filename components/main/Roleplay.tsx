'use client';

import { motion } from "framer-motion";
import { roleplaySituations } from "@/lib/roleplay";
import Link from "next/link";

export default function RoleplayCarousel() {
  const visibleCount = 2;
  const gap = 20;
  const cardWidth = 160;

  const totalItems = roleplaySituations.length;
  const fullCardWidth = cardWidth + gap;

  const dragLimit = -((totalItems - visibleCount) * fullCardWidth);

  return (
    <div className="mb-6 select-none">
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-sm text-gray-500 font-medium">Roleplay situation</span>
        <span className="font-bold text-xl text-black">Noonchi Coach</span>
      </div>
      <div className="w-[335px] overflow-hidden relative">
        <motion.div
          className="flex gap-[20px] cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: dragLimit, right: 0 }}
          transition={{ type: 'spring', bounce: 0.2 }}
        >
          {roleplaySituations.map((item) => (
            <Link
              key={item.id}
              href="/main/role"
              className="flex-shrink-0 w-[160px] h-[120px] bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center hover:shadow-xl transition-shadow duration-200"
            >
              <span className="text-center text-base font-semibold px-3 text-gray-800">
                {item.title}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
