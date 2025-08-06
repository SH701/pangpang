'use client';

import Score from '@/components/main/result/score';
import Section from '@/components/main/result/section';
import Transcript from '@/components/main/result/transscript';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Result() {
  const [tab, setTab] = useState<'transcript' | 'mistakes'>('transcript');
  const router = useRouter();
  // 추후 AI 분석 결과를 props 또는 fetch로 받아옴
  const score = { politeness: 42, naturalness: 35 };
  const userResponse = '네 맞는데 왜요.';
  const aiFeedback = {
    mistake: 'Responding bluntly can sound defensive in hierarchical settings.',
    good: 'Used polite verb endings like ~요.',
    suggestion: '죄송합니다, 제가 확인을 못 했네요.',
  };

  return (
    <div className=" bg-white flex flex-col">
      {/* 상단 평가 결과 */}
      <div className="px-4 py-5 border-b">
        <h2 className="text-lg font-semibold mb-2">Noonchi coach</h2>
        <p className="text-sm text-gray-600">
          You responded appropriately to the situation, but the tone could be more polite.
        </p>

        <div className="mt-4 space-y-2">
          <Score label="Politeness" value={score.politeness} />
          <Score label="Naturalness" value={score.naturalness} />
        </div>
      </div>

      {/* 탭 전환 */}
      <div className="flex border-b text-sm">
        <button
          onClick={() => setTab('transcript')}
          className={`flex-1 py-2 ${tab === 'transcript' ? 'font-semibold border-b-2 border-black' : 'text-gray-400'}`}
        >
          Transcript
        </button>
        <button
          onClick={() => setTab('mistakes')}
          className={`flex-1 py-2 ${tab === 'mistakes' ? 'font-semibold border-b-2 border-black' : 'text-gray-400'}`}
        >
          Common Mistakes
        </button>
      </div>

      {/* 내용 */}
      <div className="flex-1 p-4 space-y-4">
        {tab === 'transcript' ? (
          <>
            <Transcript aiMsg="한글씨, 이거 한글씨가 처리한 거 맞지?" userMsg={userResponse} />
          </>
        ) : (
          <>
            <Section title="Common Mistake" desc={aiFeedback.mistake} />
            <Section title="What you did well" desc={aiFeedback.good} />
            <Section
              title="What you can improve"
              desc={`Try: "${aiFeedback.suggestion}"`}
              type="highlight"
            />
          </>
        )}
      </div>

      {/* 완료 버튼 */}
      <div className="p-4">
        <button className="w-full bg-black text-white py-3 rounded" onClick={()=>router.push("/main")}>Complete</button>
      </div>
    </div>
  );
}
