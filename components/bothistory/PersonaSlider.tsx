/* eslint-disable @typescript-eslint/no-explicit-any */
// components/bothistory/PersonaSlider.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export type PersonaSlide =
  | { isAdd: true }
  | {
      isAdd?: false;
      personaId: number | string;
      name: string;
      profileImageUrl?: string;
    };

type Props = {
  onAdd?: () => void; // '+' 클릭
  onItemClick?: (idx: number, it: PersonaSlide) => void; // 아이템 클릭(모달 오픈용)
  itemSize?: number;
  gap?: number;
  visibleCount?: number;
  viewportWidth?: number;
  className?: string;
};

const normalizeSrc = (src?: string) =>
  !src ? "" : src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;

export default function PersonaSlider({
  onAdd,
  onItemClick,
  itemSize = 56,
  gap = 12,
  visibleCount = 5,
  viewportWidth,
  className,
}: Props) {
  const [items, setItems] = useState<PersonaSlide[]>([]);

  // ✅ API 호출
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch("/api/personas/my?page=1&size=10", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") ?? ""
            }`,
          },
        });
        const data = await res.json();

        // data가 배열이면 직접 사용, 아니면 data.content 사용
        const personas = Array.isArray(data) ? data : data?.content || [];

        const mapped: PersonaSlide[] = personas.map((p: any) => ({
          personaId: p.personaId || p.id,
          name: p.name,
          profileImageUrl: p.profileImageUrl || p.imageUrl,
        }));

        // 마지막에 '+' 버튼 추가
        setItems([{ isAdd: true }, ...mapped]);
      } catch (err) {
        console.error("Persona fetch error", err);
      }
    };

    fetchPersonas();
  }, []);

  const viewW =
    viewportWidth ?? visibleCount * itemSize + (visibleCount - 1) * gap;
  const trackWidth = useMemo(
    () =>
      items?.length ? items.length * itemSize + (items.length - 1) * gap : 0,
    [items, itemSize, gap]
  );
  const leftLimit = useMemo(
    () => Math.min(0, viewW - trackWidth),
    [viewW, trackWidth]
  );

  if (!items || items.length === 0) {
    // 로딩 또는 데이터 없음 → '+'만
    return (
      <div className="overflow-hidden" style={{ width: viewW }}>
        <button
          onClick={onAdd}
          className="rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl cursor-pointer"
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
        transition={{ type: "spring", bounce: 0.2 }}
      >
        {items.map((it, i) =>
          "isAdd" in it && it.isAdd ? (
            <button
              key={`add-${i}`}
              onClick={onAdd}
              className="rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl shrink-0"
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
                  className="w-[68px] h-[68px] rounded-full object-cover object-top bg-gray-200 cursor-pointer"
                  unoptimized
                  onClick={() => onItemClick?.(i, it)}
                />
              ) : (
                <div
                  className="rounded-full bg-gray-300 flex items-center justify-center"
                  style={{ width: itemSize, height: itemSize }}
                >
                  <span className="text-sm text-gray-600">
                    {it.name?.charAt(0) ?? "?"}
                  </span>
                </div>
              )}

              {/* ✅ 이미지 밑에 이름 표시 */}
              <span
                className="text-xs text-center truncate mt-1"
                style={{ maxWidth: itemSize }}
              >
                {it.name}
              </span>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
