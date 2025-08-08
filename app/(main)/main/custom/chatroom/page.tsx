'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function ChatRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const label = searchParams.get('label') || '사장님';
  const name = searchParams.get('name') || '';
  const gender = searchParams.get('gender') || '';
  const role = searchParams.get('role') || '';
  const situation = searchParams.get('situation') || '';


  return (
    <div className="flex flex-col h-[calc(100vh)]  bg-[#F2F7FA] w-full">
      <div className="flex justify-between items-center px-4 py-3 bg-white">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold">{role}</h1>
        <button className="text-sm text-red-500" onClick={()=>router.push( `/main/custom/chatroom/result?name=${name}&gender=${gender}&role=${role}&label=${label}&situation=${situation}`)}>대화 종료</button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 px-4 py-6 space-y-4">
        {/* AI 캐릭터 메시지 */}
        <div className="flex gap-2 items-start">
          <div className="w-7 h-7 bg-gray-400 rounded-full" />
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <div className="mt-1 px-3 py-2 bg-white rounded shadow-sm">
              <p className="text-sm">{`${name}씨, 이거 ${name}씨가 처리한 거 맞지?`}</p>
              <div className="flex gap-2 mt-2 text-gray-500 text-sm justify-between">
                <div>
                <button>🔊</button>
                <button>🌐</button>
                </div>
                <span className="text-xs px-2 py-1  text-white bg-blue-500 rounded-md">존댓말</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 메뉴 */}
      <div className="flex justify-around items-center  bg-[#EDF2F7] z-150 h-35">
        <button className="text-2xl">↩️</button>
        <button className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-2xl">
          🎤
        </button>
        <button className="text-2xl">⌨️</button>
      </div>
    </div>
  );
}
