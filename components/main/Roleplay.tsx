'use client';

import { motion } from "framer-motion";
import { roleplaySituations } from "@/lib/roleplay";
import { useState } from "react";
import Link from "next/link";

export default function RoleplayCarousel() {
  const [page, setPage] = useState(0);
  const visibleCount = 2;
  const gap = 20;        
  const cardWidth = 160; 

  const total = roleplaySituations.length;
  const maxPage = Math.ceil(total / visibleCount) - 1;

  const handlePaginate = (dir: number) => {
    setPage((prev) => {
      const next = prev + dir;
      if (next < 0) return maxPage;
      if (next > maxPage) return 0;
      return next;
    });
  };

  return (
    <div className="mb-3">
      <div className="flex flex-col">
      <span className="text-sm">Roleplay situation recommendations</span>
      <span className="font-semibold text-lg mb-2">Why not talk about this?</span>
      </div>
      <div className="w-[335px] h-35 overflow-hidden relative mb-4">
        <motion.div
          className="flex gap-[20px]"  
          animate={{ x: -(cardWidth + gap) * page }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
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

        <div className="absolute bottom-3 w-full flex justify-between px-2">
          <button onClick={() => handlePaginate(-1)} className="text-sm font-medium">
            Prev
          </button>
          <button onClick={() => handlePaginate(1)} className="text-sm font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
