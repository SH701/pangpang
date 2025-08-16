'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/UserContext';
import Score from '@/components/main/result/score';
import Transcript from '@/components/main/result/transscript';
import Section from '@/components/main/result/section';
import { Feedback } from '@/lib/types';



export default function Result() {
  const [tab, setTab] = useState<'transcript' | 'mistakes'>('transcript');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id as string | undefined; // 안전하게 캐스팅

  useEffect(() => {
    if (!conversationId || !accessToken) return;

    const loadFeedback = async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/feedback`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        });

        if (!res.ok) {
          setError(`Failed to fetch feedback: ${res.status}`);
          return;
        }

        const data: Feedback = await res.json();
        setFeedback(data);
      } catch (err) {
        setError('네트워크 오류');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [conversationId, accessToken]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!feedback) return <p className="p-6">No feedback available</p>;

  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* 상단 평가 결과 */}
      <div className="px-4 py-5 border-b bg-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <Image
            src="/circle/circle4.png"
            width={28}
            height={28}
            alt="coach"
            className="rounded-full"
          />
          <h2 className="text-base font-semibold">Noonchi coach</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {feedback.overallEvaluation ||
            'You responded appropriately to the situation, but the tone could be more polite.'}
        </p>

        <div className="space-y-3">
          <Score label="Politeness" value={feedback.politenessScore} />
          <Score label="Naturalness" value={feedback.naturalnessScore} />
          <Score label="Pronunciation" value={feedback.pronunciationScore} />
        </div>
      </div>

      {/* 탭 전환 */}
      <div className="flex border-b text-sm">
        <button
          onClick={() => setTab('transcript')}
          className={`flex-1 py-2 ${
            tab === 'transcript'
              ? 'font-semibold border-b-2 border-black'
              : 'text-gray-400'
          }`}
        >
          Transcript
        </button>
        <button
          onClick={() => setTab('mistakes')}
          className={`flex-1 py-2 ${
            tab === 'mistakes'
              ? 'font-semibold border-b-2 border-black'
              : 'text-gray-400'
          }`}
        >
          Common Mistakes
        </button>
      </div>

      {/* 내용 */}
      <div className="flex-1 p-4 space-y-4">
        {tab === 'transcript' ? (
          <Transcript
            aiMsg={feedback.summary}
            userMsg="(대화 로그는 별도 API에서 불러오면 돼)"
          />
        ) : (
          <>
            <Section title="Common Mistake" desc={feedback.improvementPoints} />
            <Section title="What you did well" desc={feedback.goodPoints} />
            <Section
              title="What you can improve"
              desc={feedback.improvementExamples}
              type="highlight"
            />
          </>
        )}
      </div>

      {/* 완료 버튼 */}
      <div className="p-4">
        <button
          className="w-full bg-black text-white py-3 rounded"
          onClick={() => router.push('/main')}
        >
          Complete
        </button>
      </div>
    </div>
  );
}
