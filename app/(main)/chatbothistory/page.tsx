'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import CharacterSlider from "@/components/bothistory/CharacterSlider";

interface HistoryItem {
  name: string;
  summary: string;
  role: string;
}

const dummyData: HistoryItem[] = [
  {
    name: "Chatting with a friend at a café",
    summary: "Talking about a recently popular TV drama",
    role: "Friend",
  },
  {
    name: "Conversation with your boss",
    summary: "One Americano, please.",
    role: "Boss",
  },
  {
    name: "Ordering coffee",
    summary: "One Americano, please.",
    role: "Cafe worker",
  },
   {
    name: "Ordering coffee",
    summary: "One Americano, please.",
    role: "Cafe worker",
  },
   {
    name: "Ordering coffee",
    summary: "One Americano, please.",
    role: "Cafe worker",
  },
];

export default function ChatbotHistory() {
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState<HistoryItem[]>(dummyData);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const handleSearch = () => {
    const lowerKeyword = keyword.toLowerCase();
    const result = dummyData.filter(item =>
      item.name.toLowerCase().includes(lowerKeyword) ||
      item.summary.toLowerCase().includes(lowerKeyword) ||
      item.role.toLowerCase().includes(lowerKeyword)
    );
    setFiltered(result);
  };

  const toggleSearch = () => setIsSearchOpen(prev => !prev);

  const toggleDetail = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  return (
    <>   
      <div className="p-4 pt-16 space-y-4 relative">
        <h1 className="absolute top-4 left-4 text-2xl font-bold z-10">
        Chat History
      </h1>
         <CharacterSlider/>
        <div className="flex justify-end items-center space-x-2 relative z-10">
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

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div>검색 결과 없음</div>
          ) : (
            filtered.map((item, idx) => (
              <div key={idx} className="bg-gray-100 rounded-xl overflow-hidden">
                <div className="flex items-center p-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300" />
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.summary}</p>
                  </div>
                  <button onClick={() => toggleDetail(idx)}  className="ml-auto"  > 
                    {openIndexes.includes(idx) ? (
                      <ChevronDownIcon className="w-6 h-6" />
                    ) : (
                      <ChevronRightIcon className="w-6 h-6 " />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {openIndexes.includes(idx) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 py-6 bg-gray-200 text-center space-y-4 text-sm"
                    >
                      <p className="font-semibold">Learning Report</p>
                      <p>the most commonly mistaken expression</p>
                      <p>Score</p>
                      <p className="underline">View entire conversation</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
