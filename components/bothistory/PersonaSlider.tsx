/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/lib/UserContext';

export type PersonaSlide =
  | { isAdd: true }
  | { isAdd?: false; personaId: number | string; name: string; profileImageUrl?: string };

type Props = {
  items: PersonaSlide[];
  onAdd?: () => void;
  itemSize?: number;        // default 56 (w-14)
  gap?: number;             // default 12 (space-x-3)
  visibleCount?: number;    // default 5
  viewportWidth?: number;   // 고정 폭을 직접 줄 때
};

const normalizeSrc = (src?: string) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return src;
  return `/${src}`;
};

export default function PersonaSlider({
  items,
  onAdd,
  itemSize = 56,
  gap = 12,
  visibleCount = 5,
  viewportWidth,
}: Props) {
  const trackWidth = useMemo(
    () => (items.length ? items.length * itemSize + (items.length - 1) * gap : 0),
    [items.length, itemSize, gap]
  );

  // 보일 영역 폭(고정 폭 주면 그 값을 사용)
  const viewW = viewportWidth ?? visibleCount * itemSize + (visibleCount - 1) * gap;

  // 트랙이 뷰포트보다 짧으면 드래그 불가, 길면 왼쪽으로만
  const leftLimit = useMemo(() => Math.min(0, viewW - trackWidth), [viewW, trackWidth])
  const {accessToken} = useAuth();
  const [sliderItems, setSliderItems] = useState<PersonaSlide[]>([{ isAdd: true }])
  // ✅ 슬라이더용: 모든 페르소나 불러오기 (필터와 무관)
    const loadPersonasForSlider = useCallback(async () => {
      if (!accessToken) return
      try {
        const res = await fetch('/api/persona/my', {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        })
  
        if (res.status === 404) {
          setSliderItems([{ isAdd: true }]) // 데이터 없으면 '+'만
          return
        }
        if (!res.ok) throw new Error('persona load failed')
  
        const data = await res.json()
        const list: PersonaSlide[] = (Array.isArray(data) ? data : [])
          .filter(Boolean)
          .map((p: any) => ({
            personaId: p.id ?? p.personaId ?? p.name,
            name: p.name || 'Unknown',
            profileImageUrl: typeof p.profileImageUrl === 'string' ? p.profileImageUrl : '',
          }))
  
        // 항상 '+'를 맨 앞에
        setSliderItems(([{ isAdd: true }, ...list] as PersonaSlide[]))
      } catch {
        setSliderItems([{ isAdd: true }])
      }
    }, [accessToken])
  
    useEffect(() => { loadPersonasForSlider() }, [loadPersonasForSlider])

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
            <div key={`${it.personaId}-${i}`} className="flex flex-col items-center shrink-0" style={{ width: itemSize }}>
              {it.profileImageUrl ? (
                <Image
                  src={normalizeSrc(it.profileImageUrl)}
                  alt={it.name}
                  width={itemSize}
                  height={itemSize}
                  className="rounded-full object-cover bg-gray-200"
                  unoptimized
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
