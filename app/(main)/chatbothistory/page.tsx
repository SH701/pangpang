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
  const [status, setStatus] = useState<"done" | "progress">("progress");
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
    <div className=" pt-10 space-y-5 relative w-full">
      <div className="flex justify-between mb-6 mx-4">
      <h1 className= "text-2xl font-bold z-10">Chat History</h1>
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

        {/* 슬라이더 */}
      <CharacterSlider />

    
      {/* 정렬 컨트롤 */}
     <div className="relative flex justify-between items-start pr-1 mx-4 "> 
      <div className="flex gap-2 *:text-xs">
      <button
        onClick={() => setStatus("done")}
        className={`px-3 py-1 rounded ${
          status === "done" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        Done
      </button>
      <button
        onClick={() => setStatus("progress")}
        className={`px-3 py-1 rounded ${
          status === "progress" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        In progress
      </button>
    </div>
  <div className="relative">
    <button
      onClick={() => setShowSortOptions(prev => !prev)}
      className="flex items-center gap-1  rounded text-xs bg-white "
    >
      {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
      <ChevronDownIcon className="w-3 h-3" />
    </button>

    {showSortOptions && (
      <div className="absolute mt-1 right-0 w-14  rounded  z-20">
        <button
          onClick={() =>
            handleSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')
          }
          className="w-full text-left text-xs  hover:bg-gray-100  "
        >
          {sortOrder === 'newest' ? 'Oldest' : 'Newest'}
        </button>
      </div>
    )}
  </div>
</div>

      {/* 히스토리 리스트 */}
      <div className=" w-full">
        {filtered.map((item, idx) => (
          <div key={idx}>
            <button
              onClick={() => toggleDetail(idx)}
              className={`w-full flex items-center justify-between text-left border-b-1 px-3 py-3 
                 hover:bg-gray-100  bg-gray-100  transition
                ${openIndexes.includes(idx) ? ' bg-blue-50' : ''}
                 ${idx === 0 ? 'rounded-t-2xl' : ''}`}
            >
              {/* 왼쪽: 프로필 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
                <div className="flex flex-col text-start">
                  <span className="font-semibold text-black">{item.role}</span>
                  <span className= "text-sm text-gray-400 truncate w-40">
                    {item.summary}
                  </span>
                </div>
              </div>

              {/* 오른쪽: 토글 */}
              <div className="flex flex-col items-end gap-1">
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
                  transition={{ duration: 0.1 }}
                  className="px-4 py-6 bg-gray-100  text-sm space-y-4"
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
