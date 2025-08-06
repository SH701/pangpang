'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import CharacterSlider from "@/components/bothistory/CharacterSlider";

interface HistoryItem {
  name: string;
  summary: string;
  role: string;
  created_at: Date;
}

const dummyData: HistoryItem[] = [
  {
    name: "Chatting with a friend at a café",
    summary: "Talking about a recently popular TV drama",
    role: "Friend",
    created_at: new Date("2025-08-06T10:30:00"),
  },
  {
    name: "Conversation with your boss",
    summary: "Discussing upcoming project deadlines",
    role: "Boss",
    created_at: new Date("2025-08-05T15:20:00"),
  },
  {
    name: "Ordering coffee",
    summary: "One Americano, please.",
    role: "Cafe worker",
    created_at: new Date("2025-08-03T09:10:00"),
  },
  {
    name: "Lunch chat with colleague",
    summary: "Where to go for lunch today?",
    role: "Hyunwoo",
    created_at: new Date("2025-07-30T12:00:00"),
  },
  {
    name: "Conversation with Nana",
    summary: "Talking about weekend plans",
    role: "Nana",
    created_at: new Date("2025-07-28T19:45:00"),
  },
];

export default function ChatbotHistory() {
  const [keyword, setKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filtered, setFiltered] = useState<HistoryItem[]>(sortItems(dummyData, 'newest'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  function sortItems(data: HistoryItem[], order: 'newest' | 'oldest') {
    return [...data].sort((a, b) =>
      order === 'newest'
        ? b.created_at.getTime() - a.created_at.getTime()
        : a.created_at.getTime() - b.created_at.getTime()
    );
  }

  const handleSearch = () => {
    const lowerKeyword = keyword.toLowerCase();
    const result = dummyData.filter(item =>
      item.name.toLowerCase().includes(lowerKeyword) ||
      item.summary.toLowerCase().includes(lowerKeyword) ||
      item.role.toLowerCase().includes(lowerKeyword)
    );
    setFiltered(sortItems(result, sortOrder));
  };

  const toggleSearch = () => setIsSearchOpen(prev => !prev);

  const toggleDetail = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  const handleSortChange = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    setShowSortOptions(false);
    setFiltered(sortItems(filtered, order));
  };

  return (
    <div className="p-4 pt-16 space-y-4 relative">
      <h1 className="absolute top-4 left-4 text-2xl font-bold z-10">Chat History</h1>
      <CharacterSlider />

      {/* 검색창 + 정렬 컨트롤 */}
      <div className="relative flex justify-end items-start pr-1">
        <div className="flex items-center space-x-2 z-20">
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="border p-1 rounded overflow-hidden placeholder:pl-1"
                placeholder="Search..."
                style={{ minWidth: 0 }}
              />
            )}
          </AnimatePresence>

          <button onClick={toggleSearch} className="cursor-pointer">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* 정렬 버튼은 아래에 절대 위치 */}
        <div className="absolute top-8 right-0 z-10">
          <button
            onClick={() => setShowSortOptions(prev => !prev)}
            className="flex items-center gap-1 border px-2 py-1 rounded text-sm bg-white"
          >
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showSortOptions && (
            <div className="mt-1 w-28 bg-white border rounded shadow text-sm z-20">
              <button
                onClick={() => handleSortChange('newest')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Newest
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Oldest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 히스토리 리스트 */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div key={idx}>
            <button
              onClick={() => toggleDetail(idx)}
              className={`w-full flex items-center justify-between text-left rounded-lg px-3 py-3 gap-3
                bg-white hover:bg-gray-100 focus:ring-2 ring-blue-300 transition
                ${openIndexes.includes(idx) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            >
              {/* 왼쪽: 프로필 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
                <div className="flex flex-col text-start">
                  <span className="text-xs text-gray-500">{item.role}</span>
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-[11px] text-gray-400 truncate w-40">
                    {item.summary}
                  </span>
                </div>
              </div>

              {/* 오른쪽: 날짜 + 토글 */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-gray-400">
                  {item.created_at.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </span>
                {openIndexes.includes(idx) ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openIndexes.includes(idx) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 py-6 bg-gray-100 rounded-b-xl text-sm space-y-4"
                >
                  <p className="font-semibold">Learning Report</p>
                  <p>the most commonly mistaken expression</p>
                  <p>Score</p>
                  <p className="underline">View entire conversation</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
