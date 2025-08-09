// components/history/PersonaSlider.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export type PersonaSlide = {
  isAdd?: false;
  personaId: number | string;
  name: string;
  profileImageUrl: string; // http or local(/avatars/..)
} | { isAdd: true };

type Props = {
  items: PersonaSlide[];
  onAdd?: () => void;      // '+' 클릭 핸들러
  visibleCount?: number;   // 한 화면에 보일 개수 (기본 3)
  itemSize?: number;       // 정사각 아이템 px (기본 56)
};

export default function PersonaSlider({
  items,
  onAdd,
  visibleCount = 3,
  itemSize = 56,
}: Props) {
  // 드래그 한계 계산
  const dragLimit = -((items.length - visibleCount) * itemSize + itemSize / 2);

  return (
    <div className="overflow-hidden w-[330px]">
      <motion.div
        className="flex space-x-3 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: dragLimit, right: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        {items.map((it, i) =>
          it.isAdd ? (
            <button
              key={`add-${i}`}
              onClick={onAdd}
              className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl shrink-0"
            >
              +
            </button>
          ) : (
            <div key={`${it.personaId}-${i}`} className="flex flex-col items-center shrink-0" style={{ width: itemSize }}>
              {it.profileImageUrl ? (
                <Image
                  src={it.profileImageUrl}
                  alt={it.name}
                  width={itemSize}
                  height={itemSize}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className="rounded-full bg-gray-300 flex items-center justify-center text-xl"
                  style={{ width: itemSize, height: itemSize }}
                >
                  {it.name?.charAt(0) ?? "?"}
                </div>
              )}
              <span className="text-xs text-center truncate max-w-14">{it.name || "Unknown"}</span>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
