/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import LottieAnimation from '@/components/etc/LottieAnimation';
import { loadLottieAnimation, LOTTIE_PATHS } from '@/lib/lottie-loader';

export default function Fifth() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const animation = await loadLottieAnimation(LOTTIE_PATHS.ON_5);
        if (animation) {
          setAnimationData(animation);
        }
      } catch (err) {
        console.error('로티 로드 중 오류:', err);
      }
    };
    loadAnimation();
  }, []);

  if (!animationData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[375px] h-[426px] flex items-center justify-center">
        <LottieAnimation
          animationData={animationData}
          style={{ width: '375px', height: '426px' }}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
} 