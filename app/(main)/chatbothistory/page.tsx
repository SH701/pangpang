/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react';
import SearchBar from '@/components/bothistory/SearchBar'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/UserContext';
import PersonaSlider, { PersonaSlide } from '@/components/bothistory/PersonaSlider';
import PersonaDetailModal from '@/components/persona/PersonaDetailModal';
import type { Conversation } from '@/lib/types';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const normalizeSrc = (src?: string) =>
  !src ? '' : src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

const getName = (name?: string) => (name && name.trim() ? name : 'Unknown');
const getInitial = (name?: string) => getName(name).charAt(0);
const getImg = (url?: string) => (typeof url === 'string' ? url : '');

export default function ChatBothistoryPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [filtered, setFiltered] = useState<Conversation[]>([]); 
  const [sliderItems, setSliderItems] = useState<PersonaSlide[]>([{ isAdd: true }]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'done' | 'in-progress'>('done');
  const filterMap: Record<'done' | 'in-progress', string> = {
    done: 'ENDED',
    'in-progress': 'ACTIVE',
  };
  const normalizeConversations = (arr: any): Conversation[] =>
    (Array.isArray(arr) ? arr : []).filter(Boolean).filter((c) => !!c?.aiPersona);
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

  useEffect(() => {
    loadPersonasFromConversations();
  }, [loadPersonasFromConversations]);


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

  useEffect(() => {
    setFiltered(history);
  }, [history]);


  useEffect(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      setFiltered(history);
      return;
    }
    setFiltered(history.filter((c) => (c.aiPersona?.name ?? '').toLowerCase().includes(q)));
  }, [keyword, history]);


  const handlePersonaDeleted = (deletedId: number | string) => {
    setSliderItems((prev) => {
      const rest = prev.filter((it) => !('isAdd' in it) && it.personaId !== deletedId);
      return [{ isAdd: true }, ...rest];
    });
    setHistory((prev) =>
      prev.filter((chat) => {
        const aid = chat.aiPersona?.id ?? (chat as any).aiPersona?.personaId;
        return aid !== deletedId;
      })
    );
    setOpenDetail(false);
  };
  const handleSearch = () => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      setFiltered(history);
      return;
    }
    setFiltered(history.filter((c) => (c.aiPersona?.name ?? '').toLowerCase().includes(q)));
  };
  const toggleSearch = () =>
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (!next) {
        setKeyword('');
        setFiltered(history);
      }
      return next;
    });

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[375px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold font-pretendard text-gray-800">Chatbot History</h1>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={handleSearch}
          isOpen={isSearchOpen}
          onToggle={() =>
            setIsSearchOpen((prev) => {
              const next = !prev
              if (!next) {
                setKeyword('')
                handleSearch() 
              }
              return next
            })
          }
          placeholder="Search..."
        />
      </div>

      {/* Persona Slider */}
      <div className="px-6 py-6">
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

      {/* Filter Buttons */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedFilter('done')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium font-pretendard transition-colors ${
              selectedFilter === 'done'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
            }`}
          >
            Done
          </button>
          <button
            onClick={() => setSelectedFilter('in-progress')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium font-pretendard transition-colors ${
              selectedFilter === 'in-progress'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
            }`}
          >
            In progress
          </button>
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 px-6 pb-6">
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 font-pretendard">Loading...</p>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-500 font-pretendard">{error}</p>
            </div>
          )}

          {/* 결과 없음 처리 */}
          {!loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Image src="/circle/circle4.png" alt="No history" width={64} height={64} className="mb-4" />
              <p className="text-gray-500 font-pretendard text-center mb-6">No chat history.</p>
              <Link href="/main/custom" className="flex items-center text-blue-600 hover:text-blue-700 font-pretendard text-sm transition-colors">
                Start a conversation with a custom chatbot
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {!loading && history.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-500 font-pretendard">검색 결과가 없습니다.</p>
            </div>
          )}

          {/* Chat History Items */}
          {filtered.map((chat) => {
            const name = getName(chat?.aiPersona?.name);
            const desc = chat?.aiPersona?.description ?? '';
            const img = getImg(chat?.aiPersona?.profileImageUrl);
            return (
              <div
                key={chat?.conversationId}
                className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="relative">
                  {img ? (
                    <Image
                      src={normalizeSrc(img)}
                      width={48}
                      height={48}
                      alt={name}
                      className="w-12 h-12 rounded-full bg-gray-100 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                      <span className="text-gray-600 font-semibold font-pretendard text-sm">{getInitial(name)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold font-pretendard text-gray-800 text-base mb-1">{name}</h3>
                  <p className="text-sm font-pretendard text-gray-600 truncate">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PersonaDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        personaId={selectedPersonaId}
        onDeleted={handlePersonaDeleted}
      />
    </div>
  );
}
