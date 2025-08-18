/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth, Level, Interest } from '@/lib/UserContext';
import ProfileChange from "@/components/afterlogin/profilechange";
import Image from "next/image"
import Loading from './loading';
import { slides } from '@/lib/setting';

const levelImg: Record<Level, string> = {
  BEGINNER: '/circle/circle1.png',
  INTERMEDIATE: '/circle/circle2.png',
  ADVANCED: '/circle/circle3.png',
};

export default function AfterPage() {
  const router = useRouter();
  const {koreanLevel, setKoreanLevel, profileImageUrl, interests, setInterests ,} = useAuth();
  const {accessToken}= useAuth();
  const sliderRef = useRef<Slider>(null);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false)
  const canSubmit = current < 2 || (koreanLevel && profileImageUrl && interests.length > 0);


   useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const settings:Settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    arrows: false,
    draggable: false,
    swipe: false, 
    afterChange: (i: number) => setCurrent(i),
    customPaging: (i: number) => (
      <button 
        className={`w-3 h-3 rounded-full ${
          i === current ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      />
    ),
  };

  const onNext = () => {
    if (current < 2) {
      sliderRef.current?.slickNext();
    } else {
      goMain();
    }
  };

const goMain = async () => {
  setError(null);
  setSubmitting(true)
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

 if (loading || submitting) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3  bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900 text-xl font-semibold font-pretendard">Profile Setup</h1>
          <button
            onClick={() => router.push('/main')}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm font-pretendard transition-colors duration-200"
          >
            Skip
          </button>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 relative h-full w-[375px] ">
          <Slider ref={sliderRef} {...settings} className="h-full">
            {/* 1. Korean Level Selection */}
            <div className="px-4 pt-4 h-full flex flex-col">
              <div className="flex-1 flex flex-col ">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2 font-pretendard leading-normal mt-4" style={{fontSize: '24px', fontWeight: 600, color: '#111827'}}>
                  Please select your <br /> Korean level
                </h1>
                <p className="text-gray-400 mb-8 font-pretendard leading-[140%]" style={{fontSize: '14px', fontWeight: 500, color: '#9CA3AF'}}>
                  Tell us how comfortable you are <br /> chatting in Korean!
                </p>

                <div className="space-y-4">
                  {(['BEGINNER','INTERMEDIATE','ADVANCED'] as Level[]).map((lvl) => (
                    <div
                      key={lvl}
                      onClick={() => setKoreanLevel(lvl)}
                      className={`flex items-center p-4 cursor-pointer transition-all duration-200 border`}
                      style={{
                        borderRadius: koreanLevel === lvl ? '12px' : '16px',
                        border: koreanLevel === lvl ? '1px solid #316CEC' : '1px solid #E5E7EB',
                        background: koreanLevel === lvl ? '#EFF6FF' : '#F9FAFB'
                      }}
                    >
                     <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={levelImg[lvl]}
                        alt={`circle-${lvl}`}
                        width={48}
                        height={48}
                        className={koreanLevel === lvl ? '' : 'opacity-60'}
                      />
                    </div>
                      <div className="flex-1">
                        <h2 className="font-semibold text-lg text-gray-900 font-pretendard">
                          {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 font-pretendard">
                          {lvl === 'BEGINNER' && "I know basic polite words, but I'm not sure when or how to use honorifics."}
                          {lvl === 'INTERMEDIATE' && "I can use endings, but I'm not confident in formal or respectful language correctly."}
                          {lvl === 'ADVANCED' && "I understand and use honorifics naturally depending on context or relationship."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Profile Picker */}
            <div className="px-4 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-start">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2 font-pretendard leading-normal mt-4" style={{fontSize: '24px', fontWeight: 600, color: '#111827'}}>
                  Choose your profile
                </h1>
                <p className="text-gray-400 mb-8 font-pretendard leading-[140%]" style={{fontSize: '14px', fontWeight: 500, color: '#9CA3AF'}}>
                  Select an avatar that represents you!
                </p>
                <ProfileChange/>
              </div>
            </div>

            {/* 3. Interests */}
            <div className="px-4 pt-4 h-full flex flex-col">
              <div className="flex-1 flex flex-col items-start">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2 font-pretendard leading-normal mt-4" style={{fontSize: '24px', fontWeight: 600, color: '#111827'}}>
                  Please select your <br /> interests
                </h1>
                <p className="text-gray-400 mb-8 font-pretendard leading-[140%]" style={{fontSize: '14px', fontWeight: 500, color: '#9CA3AF'}}>
                  Choose topics you`d like to chat about!
                </p>

                <div className="flex flex-wrap gap-3">
                  {(['💬 Daily','💼 Business','✈️ Travel','🎬 K-Drama','🎵 K-Pop','🙇‍♂️ Etiquette','🔥 Internet Slang','🥘 Food','🍜 Ordering','💄 Beauty','👁️‍🗨️ Gathering'] as string[]).map(opt => (
                    <button
                    key={opt}
                      onClick={() => {
                        const next = interests.includes(opt)
                          ? interests.filter(x => x !== opt)
                          : [...interests, opt];
                        setInterests(next);
                      }}
                      className={`flex justify-center items-center text-sm font-medium transition-all duration-200 border whitespace-nowrap cursor-pointer`}
                      style={{
                        borderRadius: interests.includes(opt as Interest) ? '99px' : '99px',
                        border: interests.includes(opt as Interest) ? '1px solid #316CEC' : '1px solid #E5E7EB',
                        background: interests.includes(opt as Interest) ? '#EFF6FF' : '#FFFFFF',
                        color: interests.includes(opt as Interest) ? '#000000' : '#000000',
                        padding: '12px'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
      
      {/* Footer */}
     <div className="fixed bottom-0 left-0 right-0 bg-white">
  <button
    disabled={!canSubmit}
    onClick={onNext} 
    className={`w-full h-[92px] py-4 font-semibold text-lg rounded-none font-pretendard ${
      canSubmit
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-[#BFDBFE] text-[#EFF6FF] cursor-not-allowed'
    }`}
    style={{
      paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
    }}
  >
    {current === slides.length-3 ? "Start":"Next"}
  </button>
</div>
</div>
  );
}