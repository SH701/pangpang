// components/bothistory/PersonaSlider.tsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export type PersonaSlide =
  | { isAdd: true }
  | { isAdd?: false; personaId: number | string; name: string; profileImageUrl?: string };

type Props = {
  items: PersonaSlide[];                         // 부모에서 공급
  onAdd?: () => void;                            // '+' 클릭
  onItemClick?: (idx: number, it: PersonaSlide) => void; // 아이템 클릭(모달 오픈용)
  itemSize?: number;
  gap?: number;
  visibleCount?: number;
  viewportWidth?: number;
};

const normalizeSrc = (src?: string) =>
  !src ? '' : src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

export default function PersonaSlider({
  items,
  onAdd,
  onItemClick,
  itemSize = 56,
  gap = 12,
  visibleCount = 5,
  viewportWidth,
}: Props) {
  const viewW = viewportWidth ?? visibleCount * itemSize + (visibleCount - 1) * gap;
  const trackWidth = useMemo(
    () => (items?.length ? items.length * itemSize + (items.length - 1) * gap : 0),
    [items, itemSize, gap]
  );
  const leftLimit = useMemo(() => Math.min(0, viewW - trackWidth), [viewW, trackWidth]);

  if (!items || items.length === 0) {
    // 비어있을 때 '+'만 노출
    return (
      <div className="overflow-hidden" style={{ width: viewW }}>
        <button
          onClick={onAdd}
          className="rounded-full bg-black text-white flex items-center justify-center text-2xl"
          style={{ width: itemSize, height: itemSize }}
          aria-label="Add persona"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden" style={{ width: viewW }}>
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{ columnGap: gap, width: trackWidth }}
        drag="x"
        dragConstraints={{ left: leftLimit, right: 0 }}
        transition={{ type: 'spring', bounce: 0.2 }}
      >
        {items.map((it, i) =>
          'isAdd' in it && it.isAdd ? (
            <button
              key={`add-${i}`}
              onClick={onAdd}
              className="rounded-full bg-black text-white flex items-center justify-center text-2xl shrink-0"
              style={{ width: itemSize, height: itemSize }}
              aria-label="Add persona"
            >
              +
            </button>
          ) : (
            <div
              key={`${it.personaId}-${i}`}
              className="flex flex-col items-center shrink-0"
              style={{ width: itemSize }}
            >
              {it.profileImageUrl ? (
                <Image
                  src={normalizeSrc(it.profileImageUrl)}
                  alt={it.name}
                  width={itemSize}
                  height={itemSize}
                  className="rounded-full object-cover bg-gray-200 cursor-pointer"
                  unoptimized
                  onClick={() => onItemClick?.(i, it)}            // 아이템 클릭 이벤트 전달
                />
              ) : (
                <div
                  className="rounded-full bg-gray-300 flex items-center justify-center"
                  style={{ width: itemSize, height: itemSize }}
                >
                  <span className="text-sm text-gray-600">{it.name?.charAt(0) ?? '?'}</span>
                </div>
              )}
              <span className="text-xs text-center truncate" style={{ maxWidth: itemSize }}>
                {it.name}
              </span>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
