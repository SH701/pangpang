/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/UserContext';
import CharacterSlider from '@/components/bothistory/CharacterSlider';

type Conversation = {
  conversationId: number;
  personaId: number;
  personaName: string;
  gender: string;
  age: number;
  relationship: string;
  description: string;
  profileImageUrl: string;
  status: string;
  situation: string;
};

export default function ChatHistory() {
  const { accessToken } = useAuth();
  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'done' | 'in-progress'>('done');

  // 필터값 -> status 파라미터 변환
  const filterMap: Record<typeof selectedFilter, string> = {
    'done': 'ENDED',
    'in-progress': 'ACTIVE',
  };

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    fetch(
      `/api/conversations?status=${filterMap[selectedFilter]}&page=1&size=20`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        setHistory(data.content ?? []);
        setLoading(false);
      })
      .catch(err => {
        setError('불러오기 실패');
        setLoading(false);
        console.error(err)
      });
  }, [accessToken, selectedFilter]);

  return (
    <div className=" bg-white relative">
      <CharacterSlider/>

      {/* Filter Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFilter('done')}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                selectedFilter === 'done'
                  ? 'border-blue-500 text-blue-500 bg-white'
                  : 'border-gray-300 text-gray-500 bg-white'
              }`}
            >
              Done
            </button>
            <button
              onClick={() => setSelectedFilter('in-progress')}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
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

      {/* Chat History List */}
      <div className="px-4 pb-20">
        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {history.length === 0 && !loading && <p className="text-gray-400 text-center">No chat history.</p>}
          {history.map(chat => (
            <div
              key={chat.conversationId}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                {chat.profileImageUrl && chat.profileImageUrl.startsWith('http') ? (
                  <Image
                    src={chat.profileImageUrl}
                    width={48}
                    height={48}
                    alt={chat.personaName}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-gray-600 font-semibold text-sm">
                      {chat.personaName?.charAt(0)}
                    </span>
                  </div>
                )}
                {/* 날짜 등 추가 필요시 여기에 */}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black text-base">{chat.personaName}</h3>
                <p className="text-sm text-black truncate">{chat.description}</p>
                <p className="text-xs text-gray-500">{chat.situation}</p>
              </div>
              {/* 원하는 아이콘 등 추가 */}
            </div>
          ))}
        </div>
      </div>
      {/* ... (네비게이션 등) ... */}
    </div>
  );
}
