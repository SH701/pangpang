'use client';

import { roleplaySituations } from "@/lib/roleplay";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function RoleplaySlider() {
  const [[page, direction], setPage] = useState([0, 0]);
  const paginate = (newDirection: number) => {
    setPage(([prevPage]) => {
      const next = (prevPage + newDirection + roleplaySituations.length) % roleplaySituations.length;
      return [next, newDirection];
    });
  };

  const current = roleplaySituations[page];

  return (
      <>
      <div className="mb-3">
      <span>Roleplay situation recommendations</span>
      </div>
    <div className="w-[335px] max-w-md overflow-hidden relative h-[140px] bg-white rounded-xl shadow mb-4">
      <AnimatePresence custom={direction}>
        <motion.a
          href="/main/role"
          key={current.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4 }}
          className="absolute w-full h-full flex items-center justify-center bg-gray-200 rounded-xl"
        >
          
          <span className="text-center text-base font-semibold px-4">{current.title}</span>
        </motion.a>
      </AnimatePresence>

      <div className="absolute bottom-3 w-full flex justify-between px-5">
        <button onClick={() => paginate(-1)} className="text-sm font-medium">
           Prev
        </button>
        <button onClick={() => paginate(1)} className="text-sm font-medium">
          Next 
        </button>
      </div>
    </div>
    </>
  );
}