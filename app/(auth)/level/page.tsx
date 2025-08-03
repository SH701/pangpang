"use client";

import { useState } from "react";
import { setlevel } from "@/lib/setlevel";
import Link from "next/link";

export default function Level() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-[#0a0a0a]">
      <div className="flex flex-col justify-center items-center gap-6 max-w-md text-center">
        <div className="space-y-1">
          <p className="text-lg font-semibold">영어 스피킹 수준은</p>
          <p className="text-lg font-semibold">어느정도라고 생각하시나요?</p>
          <p className="text-xs text-gray-500 mt-1">
            난이도 변경은 언제든지 가능해요
          </p>
        </div>

        <div className="flex gap-3 w-full">
          {setlevel.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedId(level.id)}
              className={`flex-1 py-3 rounded-md font-medium transition border ${
                selectedId === level.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border-gray-300"
              }`}
              aria-pressed={selectedId === level.id}
            >
              {level.difficulty}
            </button>
          ))}
        </div>

        {selectedId && (
          <div className="mt-4">
            <p>
              선택된 수준: <span className="font-bold">{setlevel.find(l => l.id === selectedId)?.difficulty}</span>
            </p>
          </div>
        )}
        <Link href="/main">메인 페이지로 이동</Link>
      </div>
    </div>
  );
}
