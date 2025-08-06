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
    <div className="mb-3 select-none">
      <div className="flex flex-col">
        <span className="text-sm">Roleplay situation recommendations</span>
        <span className="font-semibold text-lg mb-2">Why not talk about this?</span>
      </div>
      <div className="w-[335px] overflow-hidden relative mb-4">
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
              className="flex-shrink-0 w-[160px] h-[140px] bg-gray-200 rounded-xl shadow flex items-center justify-center"
            >
              <span className="text-center text-base font-semibold px-2">
                {item.title}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
