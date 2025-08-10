/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth, Level, Interest } from '@/lib/UserContext';
import ProfileChange from "@/components/afterlogin/profilechange";
import Image from "next/image"

const levelImg: Record<Level, string> = {
  BEGINNER: '/circle/circle1.png',
  INTERMEDIATE: '/circle/circle2.png',
  ADVANCED: '/circle/circle3.png',
};

export default function AfterPage() {
  const router = useRouter();
  const { 
    koreanLevel, setKoreanLevel, 
    profileImageUrl, 
    interests, setInterests ,
  } = useAuth();
  const {accessToken}= useAuth();

  const sliderRef = useRef<Slider>(null);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

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
  setLoading(true);

  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`; // ✅ 있을 때만

  try {
    const res = await fetch('/api/users/me/profile', {
      method: 'PUT',
      headers,
      credentials: 'include', // ✅ 쿠키도 함께 전달(프록시가 쿠키→Bearer 재구성 가능)
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



  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 relative">
        <Slider ref={sliderRef} {...settings}>
          <div className="px-4 pt-8 mt-20">
            <h1 className=" text-2xl font-semibold">
              Please select your <br /> Korean level
            </h1>
            <p className=" text-gray-500 text-sm mt-2">
              Tell us how comfortable you are <br /> chatting in Korean!
            </p>

            <div className="mt-10 space-y-8">
              {(['BEGINNER','INTERMEDIATE','ADVANCED'] as Level[]).map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => setKoreanLevel(lvl)}
                  className={`flex items-center px-2 py-4 rounded-xl space-x-4 cursor-pointer
                    ${koreanLevel === lvl ? 'bg-blue-50 border border-blue-300' : 'bg-gray-50'}
                  `}
                >
                 <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
  <Image
    src={levelImg[lvl]}
    alt={`circle-${lvl}`}
    width={32}
    height={32}
    className={koreanLevel === lvl ? '' : 'opacity-50'}
  />
</div>
                  <div className="ml-2">
                    <h2 className="font-semibold">{lvl.charAt(0) + lvl.slice(1).toLowerCase()}</h2>
                    <p className="text-[13px] text-gray-600 mt-1">
                      {lvl === 'BEGINNER' && "I know basic polite words, but I'm not sure when or how to use honorifics."}
                      {lvl === 'INTERMEDIATE' && "I can use endings, but I'm not confident in formal or respectful language correctly."}
                      {lvl === 'ADVANCED' && "I understand and use honorifics naturally depending on context or relationship."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Profile Picker */}
         <ProfileChange/>

          {/* 3. Interests */}
          <div className="px-4 pt-8 mt-20 ">
            <h1 className="text-2xl font-semibold">
              Please select your <br /> interests
            </h1>

            <div className="mt-16 grid grid-cols-2 gap-3 ">
              {(['💬 Daily','💼 Business','✈️ Travel','🎬 K-Drama','🎵 K-Pop','🙇‍♂️ Etiquette','🔥 Internet Slang','🥘 Food','🍜 Ordering','💄 Beauty','👁️‍🗨️ Gathering'] as string[]).map(opt => (
                <button
                key={opt}
  onClick={() => {
    const next = interests.includes(opt)
      ? interests.filter(x => x !== opt)
      : [...interests, opt];
    setInterests(next);
  }}
  className={`flex justify-center items-center px-4 py-2 border rounded-full text-[15px] ${
                    interests.includes(opt as Interest)
                      ? 'bg-blue-50 border-blue-600 '
                      : 'bg-white border-gray-300 '
                  }`}
>
  {opt}
</button>
              ))}
            </div>
          </div>
        </Slider>
      </div>
      <footer className="p-4 bg-blue-600">
        <div className="flex space-x-4">
          <button
            onClick={onNext}
            className="flex-1 py-3 bg-blue-600 font-semibold text-white text-lg"
          >
            {current < 2 ? 'Next' : 'Finish'}
          </button>
        </div>
        {error && <p className="mt-2 text-center text-red-500">{error}</p>}
      </footer>
    </div>
  );
}
