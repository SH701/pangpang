/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Level, Interest } from '@/lib/UserContext';
import ProfileChange from "@/components/afterlogin/profilechange";
import Image from "next/image";

const levelImg: Record<Level, string> = {
  BEGINNER: '/circle/circle1.png',
  INTERMEDIATE: '/circle/circle2.png',
  ADVANCED: '/circle/circle3.png',
};

const INTERESTS_OPTIONS = [
  '💬 Daily', '💼 Business', '✈️ Travel', '🎬 K-Drama', 
  '🎵 K-Pop', '🙇‍♂️ Etiquette', '🔥 Internet Slang', 
  '🥘 Food', '🍜 Ordering', '💄 Beauty', '👁️‍🗨️ Gathering'
] as const;

export default function AfterPage() {
  const router = useRouter();
  const { 
    koreanLevel, setKoreanLevel, 
    profileImageUrl, 
    interests, setInterests,
  } = useAuth();
  const { accessToken } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goMain = async () => {
    setError(null);
    setLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch('/api/users/me/profile', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ koreanLevel, profileImageUrl, interests }),
      });

      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : await res.text();

      if (!res.ok) {
        setError(typeof data === 'string' ? data : data?.message || '설정에 실패했습니다.');
        return;
      }

      router.replace('/main');
    } catch (e) {
      console.error(e);
      setError('알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            i + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const renderKoreanLevelStep = () => (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-2">
        한국어 수준을 선택해주세요
      </h1>
      <p className="text-gray-500 text-sm text-center mb-8">
        한국어로 대화할 때 얼마나 편안한지 알려주세요!
      </p>

      <div className="space-y-4">
        {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as Level[]).map((lvl) => (
          <div
            key={lvl}
            onClick={() => setKoreanLevel(lvl)}
            className={`flex items-center p-4 rounded-xl space-x-4 cursor-pointer transition-all duration-200 ${
              koreanLevel === lvl 
                ? 'bg-blue-50 border-2 border-blue-300 shadow-md' 
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={levelImg[lvl]}
                alt={`circle-${lvl}`}
                width={48}
                height={48}
                className={koreanLevel === lvl ? '' : 'opacity-60'}
              />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">
                {lvl === 'BEGINNER' && '초급'}
                {lvl === 'INTERMEDIATE' && '중급'}
                {lvl === 'ADVANCED' && '고급'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {lvl === 'BEGINNER' && "기본적인 예의말은 알지만, 언제 어떻게 사용해야 할지 모르겠어요."}
                {lvl === 'INTERMEDIATE' && "어미는 사용할 수 있지만, 공식적이거나 존댓말을 정확하게 사용하는 데 자신이 없어요."}
                {lvl === 'ADVANCED' && "상황이나 관계에 따라 존댓말을 자연스럽게 이해하고 사용할 수 있어요."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-2">
        프로필을 설정해주세요
      </h1>
      <p className="text-gray-500 text-sm text-center mb-8">
        나를 표현할 수 있는 프로필을 만들어보세요!
      </p>
      <ProfileChange />
    </div>
  );

  const renderInterestsStep = () => (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-2">
        관심사를 선택해주세요
      </h1>
      <p className="text-gray-500 text-sm text-center mb-8">
        대화하고 싶은 주제들을 선택해주세요!
      </p>

      <div className="grid grid-cols-2 gap-3">
        {INTERESTS_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              const next = interests.includes(opt)
                ? interests.filter(x => x !== opt)
                : [...interests, opt];
              setInterests(next);
            }}
            className={`flex justify-center items-center px-4 py-3 border-2 rounded-full text-sm font-medium transition-all duration-200 ${
              interests.includes(opt as Interest)
                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-md'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderKoreanLevelStep();
      case 2:
        return renderProfileStep();
      case 3:
        return renderInterestsStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with step indicator */}
      <div className="pt-16 pb-8">
        {renderStepIndicator()}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        {renderCurrentStep()}
      </div>

      {/* Footer with navigation */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex space-x-4">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              이전
            </button>
          )}
          
          <button
            onClick={currentStep === totalSteps ? goMain : nextStep}
            disabled={loading}
            className={`flex-1 py-3 px-6 font-semibold text-white rounded-lg transition-colors duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '처리중...' : currentStep === totalSteps ? '완료' : '다음'}
          </button>
        </div>
        
        {error && (
          <p className="mt-3 text-center text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
