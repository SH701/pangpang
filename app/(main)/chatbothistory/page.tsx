// app/(main)/chatbothistory/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/UserContext';
import PersonaSlider, { PersonaSlide } from '@/components/bothistory/PersonaSlider';
import PersonaDetailModal from '@/components/persona/PersonaDetailModal';
import type { Conversation } from '@/lib/types';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const normalizeSrc = (src?: string) =>
  !src ? '' : src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

const getName = (name?: string) => (name && name.trim() ? name : 'Unknown');
const getInitial = (name?: string) => getName(name).charAt(0);
const getImg = (url?: string) => (typeof url === 'string' ? url : '');

export default function ChatBothistoryPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  // 슬라이더 데이터
  const [sliderItems, setSliderItems] = useState<PersonaSlide[]>([{ isAdd: true }]);

  // 모달 상태
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | string | null>(null);

  // 리스트(필터)
  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'done' | 'in-progress'>('done');

  const filterMap: Record<typeof selectedFilter, string> = {
    done: 'ENDED',
    'in-progress': 'ACTIVE',
  };

  const normalizeConversations = (arr: any): Conversation[] =>
    (Array.isArray(arr) ? arr : []).filter(Boolean).filter(c => !!c?.aiPersona);

  // 슬라이더용 페르소나 수집 (대화에서 고유 aiPersona 추출)
  const loadPersonasFromConversations = useCallback(async () => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const toSlides = (convos: Conversation[]): PersonaSlide[] => {
      const map = new Map<string | number, PersonaSlide>();
      for (const c of convos) {
        const ai: any = c?.aiPersona;
        if (!ai) continue;
        const id = ai.id ?? ai.personaId ?? ai.name;
        if (id == null || map.has(id)) continue;
        map.set(id, {
          personaId: id,
          name: ai.name || 'Unknown',
          profileImageUrl: typeof ai.profileImageUrl === 'string' ? ai.profileImageUrl : '',
        });
      }
      return Array.from(map.values());
    };

    try {
      const allRes = await fetch(`/api/conversations?status=ALL&page=1&size=200`, { headers, cache: 'no-store' });
      if (allRes.ok) {
        const allData = await allRes.json();
        const slides = toSlides(normalizeConversations(allData?.content));
        setSliderItems(([{ isAdd: true }, ...slides] as PersonaSlide[]));
        return;
      }

      // fallback: ENDED + ACTIVE
      const [endedRes, activeRes] = await Promise.all([
        fetch(`/api/conversations?status=ENDED&page=1&size=200`, { headers, cache: 'no-store' }),
        fetch(`/api/conversations?status=ACTIVE&page=1&size=200`, { headers, cache: 'no-store' }),
      ]);

      const [endedJson, activeJson] = await Promise.all([
        endedRes.ok ? endedRes.json() : { content: [] },
        activeRes.ok ? activeRes.json() : { content: [] },
      ]);

      const ended = normalizeConversations(endedJson?.content);
      const active = normalizeConversations(activeJson?.content);
      const slides = toSlides([...active, ...ended]);
      setSliderItems(([{ isAdd: true }, ...slides] as PersonaSlide[]));
    } catch {
      setSliderItems([{ isAdd: true }]);
    }
  }, [accessToken]);

  useEffect(() => { loadPersonasFromConversations(); }, [loadPersonasFromConversations]);

  // 리스트 로드 (필터 적용)
  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const status = filterMap[selectedFilter];
    fetch(`/api/conversations?status=${status}&page=1&size=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => setHistory(normalizeConversations(data?.content)))
      .catch(() => setError('불러오기 실패'))
      .finally(() => setLoading(false));
  }, [accessToken, selectedFilter]);
 const handlePersonaDeleted = (deletedId: number | string) => {
  setSliderItems(prev => {
    const rest = prev.filter(it => !('isAdd' in it) && it.personaId !== deletedId);
    return [{ isAdd: true }, ...rest];
  });
  setHistory(prev =>
    prev.filter(chat => {
      const aid = chat.aiPersona?.id ?? (chat as any).aiPersona?.personaId;
      return aid !== deletedId;
    })
  );
  setOpenDetail(false);
};
  return (
    <div className="bg-white w-full p-6 flex flex-col">
      <span className="text-left font-semibold text-xl my-6">Chat History</span>

      {/* 슬라이더: 아이템 클릭 → 상세 모달 */}
      <div className="mb-6">
        <PersonaSlider
          items={sliderItems}
          onAdd={() => router.push('/main/custom')}
          visibleCount={5}
          itemSize={56}
          onItemClick={(_, it) => {
            if ('isAdd' in it) return;
            setSelectedPersonaId(it.personaId);
            setOpenDetail(true);
          }}
        />
      </div>

      {/* 상세 모달 */}
      <PersonaDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        personaId={selectedPersonaId}
        onDeleted={
          handlePersonaDeleted }
      />

      {/* 필터 (리스트만 영향) */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFilter('done')}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                selectedFilter === 'done'
                  ? 'border-blue-500 text-blue-500 bg-white'
                  : 'border-gray-300 text-gray-500 bg-white'
              }`}
            >
              Done
            </button>
            <button
              onClick={() => setSelectedFilter('in-progress')}
              className={`px-4 py-1 rounded-full border text-xs font-medium transition-colors ${
                selectedFilter === 'in-progress'
                  ? 'border-blue-500 text-blue-500 bg-white'
                  : 'border-gray-300 text-gray-500 bg-white'
              }`}
            >
              In progress
            </button>
          </div>
        </div>
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {(!history || history.length === 0) && !loading && (
             < div className='flex flex-col items-center justify-center mt-20'>
              <Image src="/circle/circle4.png" alt='loading' width={81} height={81}/>
              <p className="text-gray-400 text-center mt-10">No chat history.</p>
              <Link 
      href="/main/custom" 
      className="flex items-center text-blue-500 hover:underline text-sm" 
    >
      Start a conversation with a custom chatbot
      <ChevronRightIcon className="size-4 pt-1" />
      </Link>
            </div>
          )}

          {(history ?? []).map((chat) => {
            const name = getName(chat?.aiPersona?.name);
            const desc = chat?.aiPersona?.description ?? '';
            const img = getImg(chat?.aiPersona?.profileImageUrl);
            return (
              <div
                key={chat?.conversationId ?? Math.random().toString(36).slice(2)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  {img ? (
                    <Image
                      src={normalizeSrc(img)}
                      width={48}
                      height={48}
                      alt={name}
                      className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-gray-600 font-semibold text-sm">
                        {getInitial(name)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black text-base">{name}</h3>
                  <p className="text-sm text-black truncate">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
