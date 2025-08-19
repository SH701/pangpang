/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
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

type Filter = 'done' | 'in-progress';

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
  const [selectedFilter, setSelectedFilter] = useState<Filter|null>(null);
  const [expanded, setExpanded] = useState<Record<string | number, boolean>>({});

  const filterMap: Record<'done' | 'in-progress', string> = {
    done: 'ENDED',
    'in-progress': 'ACTIVE',
  };

  const normalizeConversations = (arr: any): Conversation[] =>
    (Array.isArray(arr) ? arr : []).filter(Boolean).filter((c) => !!c?.aiPersona);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    let query = "/api/conversations?sortBy=CREATED_AT_DESC&page=1&size=1000";
    if (selectedFilter === "done" || selectedFilter === "in-progress") {
      query += `&status=${filterMap[selectedFilter]}`;
    }

    fetch(query, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`${res.status} ${res.statusText}: ${errText}`);
        }
        return res.json();
      })
      .then((data) => {
        const sorted = normalizeConversations(data?.content).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setHistory(sorted);
      })
      .catch((err) => {
        console.error("API 호출 에러:", err);
        setError(err.message);
      })
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

  const handleFilterClick = (filter: Filter) => {
    setSelectedFilter((prev) => (prev === filter ? null : filter));
  };

  const handleOpenChat = (conversationId: string | number) => {
    router.push(`/main/custom/chatroom/${conversationId}`);
  };

  const handleDeleteChat = async (conversationId: string | number) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new Error('Failed to delete chat');
      }

      setHistory((prev) => prev.filter((chat) => chat.conversationId !== conversationId));
    } catch (err) {
      console.error('Delete chat error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 font-pretendard">
            Chat History
          </h1>
          <button 
            onClick={toggleSearch} 
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Input */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              key="search-input"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setFiltered(history.filter((c) => (c.aiPersona?.name ?? '').toLowerCase().includes(keyword.trim().toLowerCase())))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search conversations..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persona Slider */}
      <div className="px-4 py-6 bg-gray-50">
        <PersonaSlider
          onAdd={() => router.push('/main/custom')}
          visibleCount={4}
          itemSize={72}
          onItemClick={(_, it) => {
            if ('isAdd' in it) return;
            setSelectedPersonaId(it.personaId);
            setOpenDetail(true);
          }}
        />
      </div>

      {/* Filter Buttons */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterClick('done')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'done'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleFilterClick('in-progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'in-progress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-4">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {!loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Image src="/characters/Noonchicoach.svg" alt="No history" width={80} height={80} />
              </div>
              <p className="text-gray-500 text-center mb-4 font-medium">
                No chat history yet
              </p>
              <Link 
                href="/main/custom" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Start your first conversation
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}

          {!loading && history.length > 0 && filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No conversations found.</p>
            </div>
          )}

          {filtered.map((chat) => {
            const name = getName(chat?.aiPersona?.name);
            const desc = chat?.aiPersona?.description ?? '';
            const img = getImg(chat?.aiPersona?.profileImageUrl);
            const situationLabel = getSituationLabel((chat as any)?.situation);
            const isOpen = expanded[chat.conversationId];

            return (
              <div key={chat.conversationId} className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(chat.conversationId)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
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

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-base truncate">{name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            chat.status === 'ACTIVE'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {chat.status === 'ACTIVE' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {situationLabel || desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <span className="text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Actions */}
                {isOpen && chat.status === 'ACTIVE' && (
                  <div className="pt-4 space-y-2">
                    <button 
                      onClick={() => handleOpenChat(chat.conversationId)} 
                      className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue Chat
                    </button>
                    <button 
                      onClick={() => handleDeleteChat(chat.conversationId)} 
                      className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                {isOpen && chat.status === 'ENDED' && (
                  <div className="pt-4">
                    <FeedbackSection id={chat.conversationId} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Persona Detail Modal */}
      <PersonaDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        personaId={selectedPersonaId}
        onDeleted={handlePersonaDeleted}
      />
    </div>
  );
}