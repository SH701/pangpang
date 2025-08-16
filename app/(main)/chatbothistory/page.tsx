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
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import FeedbackSection from '@/components/bothistory/Feedbacksections';

const situationOptions = {
  BOSS: [
    { value: 'BOSS1', label: 'Apologizing for a mistake at work.' },
    { value: 'BOSS2', label: 'Requesting half-day or annual leave' },
    { value: 'BOSS3', label: 'Requesting feedback on work' },
  ],
  GF_PARENTS: [
    { value: 'GF_PARENTS1', label: 'Meeting for the first time' },
    { value: 'GF_PARENTS2', label: 'Asking for permission' },
    { value: 'GF_PARENTS3', label: 'Discussing future plans' },
  ],
  CLERK: [
    { value: 'CLERK1', label: 'Making a reservation' },
    { value: 'CLERK2', label: 'Asking for information' },
    { value: 'CLERK3', label: 'Filing a complaint' },
  ],
} as const;

const getSituationLabel = (value?: string) => {
  if (!value) return '';
  for (const key in situationOptions) {
    const found = situationOptions[key as keyof typeof situationOptions].find(
      (opt) => opt.value === value
    );
    if (found) return found.label;
  }
  return value;
};

const getName = (name?: string) => (name && name.trim() ? name : 'Unknown');
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
  const [expanded, setExpanded] = useState<Record<string | number, boolean>>({}); // ✅ 각 채팅별 열림 상태

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

  const toggleSearch = () =>
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (!next) {
        setKeyword('');
        setFiltered(history);
      }
      return next;
    });

  const toggleExpand = (id: number | string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-gray-100 w-full flex flex-col pt-10">
      <div className="flex justify-between items-center space-x-2 relative z-10 px-4">
        <h1 className="text-xl font-bold z-10">Chatbot History</h1>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.input
              key="search-input"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setFiltered(history.filter((c) => (c.aiPersona?.name ?? '').toLowerCase().includes(keyword.trim().toLowerCase())))}
              className="border p-1 rounded overflow-hidden placeholder:pl-1 my-1"
              placeholder="Search..."
              style={{ minWidth: 0 }}
            />
          )}
        </AnimatePresence>
        <button onClick={toggleSearch} className="cursor-pointer my-2">
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="mb-4 p-6">
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

      <PersonaDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        personaId={selectedPersonaId}
        onDeleted={handlePersonaDeleted}
      />

      <div className="mb-6 px-6">
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

      <div className="flex-1 overflow-y-auto pb-24 bg-white p-6 border-t">
        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20">
              <Image src="/circle/circle4.png" alt="loading" width={81} height={81} />
              <p className="text-gray-400 text-center mt-10">No chat history.</p>
              <Link href="/main/custom" className="flex items-center text-blue-500 hover:underline text-sm">
                Start a conversation with a custom chatbot
                <ChevronRightIcon className="size-4 pt-1" />
              </Link>
            </div>
          )}

          {!loading && history.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10">
              <p className="text-gray-400">No search results.</p>
            </div>
          )}

          {filtered.map((chat) => {
            const name = getName(chat?.aiPersona?.name);
            const desc = chat?.aiPersona?.description ?? '';
            const img = getImg(chat?.aiPersona?.profileImageUrl);
            const situationLabel = getSituationLabel((chat as any)?.situation);
            const isOpen = expanded[chat.conversationId];

            return (
              <div key={chat.conversationId} className="border-b">
                <div
                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(chat.conversationId)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      {img ? (
                        <Image
                          src={img}
                          width={48}
                          height={48}
                          alt={name}
                          className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-gray-600 font-semibold text-sm">
                            {name?.[0] ?? '?'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-black text-base truncate">{name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            chat.status === 'ACTIVE'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-green-100 text-green-500'
                          }`}
                        >
                          {chat.status === 'ACTIVE' ? 'In progress' : 'Done'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {situationLabel || desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>
                      {new Date(chat.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {chat.status === 'ENDED' && <span>{isOpen ? '▲' : '▼'}</span>}
                  </div>
                </div>
                {isOpen  && chat.status === 'ENDED'&&(
                  <FeedbackSection id={chat.conversationId}/>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
