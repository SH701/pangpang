'use client';

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
    <div className="min-h-screen bg-white flex flex-col max-w-[375px] mx-auto">
      {/* 상단 평가 결과 */}
      <div className="px-6 py-8 border-b border-gray-200 bg-[#EFF6FF]">
        {/* Noonchi coach 로고와 제목 */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="/characters/Noonchicoach.svg" 
            alt="Noonchi coach" 
            className="w-[34px] h-[34px]"
          />
          <h2 className="text-[20px] font-semibold font-pretendard text-gray-800 leading-[130%]">Noonchi coach</h2>
        </div>
        
        {/* 피드백 메시지 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <p className="text-base font-medium font-pretendard text-gray-800 leading-[140%]">
            You responded appropriately to the situation, but the tone could be more polite.
          </p>
        </div>

        {/* 점수 및 프로그레스 바 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 font-pretendard">Politeness</span>
            <span className="text-sm font-semibold text-gray-900 font-pretendard">{score.politeness}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${score.politeness}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 font-pretendard">Naturalness</span>
            <span className="text-sm font-semibold text-gray-900 font-pretendard">{score.naturalness}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${score.naturalness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 탭 전환 */}
      <div className="flex border-b border-gray-200 text-sm">
        <button
          onClick={() => setTab('transcript')}
          className={`flex-1 py-3 px-4 font-pretendard transition-colors ${
            tab === 'transcript' 
              ? 'font-semibold border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Transcript
        </button>
        <button
          onClick={() => setTab('mistakes')}
          className={`flex-1 py-3 px-4 font-pretendard transition-colors ${
            tab === 'mistakes' 
              ? 'font-semibold border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Common Mistakes
        </button>
      </div>

      {/* 내용 */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {tab === 'transcript' ? (
          <>
            <Transcript aiMsg="한글씨, 이거 한글씨가 처리한 거 맞지?" userMsg={userResponse} />
          </>
        ) : (
          <>
            {/* Conversation Summary */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold font-pretendard text-gray-800 leading-none">Conversation Summary</h3>
              <div className="flex p-5 justify-center items-center gap-2.5 self-stretch rounded-xl bg-gray-100">
                <p className="text-sm text-gray-700 font-pretendard leading-relaxed">
                  대화에서 존댓말을 사용했지만, 더 정중한 표현을 사용할 수 있었습니다.
                </p>
              </div>
            </div>

            {/* What you did well */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold font-pretendard text-gray-800 leading-none">What you did well</h3>
              <div className="flex p-5 justify-center items-center gap-2.5 self-stretch rounded-xl bg-gray-100">
                <p className="text-sm text-gray-700 font-pretendard leading-relaxed">
                  기본적인 존댓말 어미(~요)를 사용하여 정중함을 표현했습니다.
                </p>
              </div>
            </div>

            {/* What you can improve */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold font-pretendard text-gray-800 leading-none">What you can improve</h3>
              
              {/* Single card with two sections separated by line */}
              <div className="flex flex-col p-5 justify-center items-center gap-2.5 self-stretch rounded-xl bg-gray-100">
                {/* First section - English explanation */}
                <div className="w-full">
                  <p className="text-sm text-gray-700 font-pretendard leading-relaxed">
                    Saying "왜요" or "그래요?" sounds quite blunt to a boss. Using softer, more deferential expressions would help.
                  </p>
                </div>
                
                {/* Divider line */}
                <div className="w-full h-px bg-gray-300 my-4"></div>
                
                {/* Second section - Try button with Korean suggestions */}
                <div className="w-full">
                  <div className="flex items-start gap-4">
                    <button className="bg-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium font-pretendard hover:bg-blue-300 transition-colors">
                      Try
                    </button>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-700 font-pretendard leading-relaxed">
                        "혹시 어떤 부분이 잘못됐을까요?"
                      </p>
                      <p className="text-sm text-gray-700 font-pretendard leading-relaxed">
                        "죄송합니다, 제가 확인을 못 했네요."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 완료 버튼 */}
      <div className="px-6 py-6 border-t border-gray-200">
        <button 
          className="w-full py-3 bg-blue-600 font-medium text-white text-lg rounded-md hover:bg-gray-900 transition-colors duration-200" 
          onClick={() => router.push("/main")}
        >
          Complete
        </button>
      </div>
    </div>
  );
}
