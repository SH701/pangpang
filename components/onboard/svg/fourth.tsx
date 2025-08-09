/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import LottieAnimation from '@/components/etc/LottieAnimation';
import { loadLottieAnimation, LOTTIE_PATHS } from '@/lib/lottie-loader';

export default function Fourth() {
  const [frameAnimation, setFrameAnimation] = useState<any>(null);
  const [innerAnimation, setInnerAnimation] = useState<any>(null);

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        // 프레임 애니메이션 로드
        const frame = await loadLottieAnimation(LOTTIE_PATHS.ON_4);
        if (frame) {
          setFrameAnimation(frame);
        }

        // 내부 애니메이션 로드
        const inner = await loadLottieAnimation(LOTTIE_PATHS.ON_4_1);
        if (inner) {
          setInnerAnimation(inner);
        }
      } catch (err) {
        console.error('로티 로드 중 오류:', err);
      }
    };
    loadAnimations();
  }, []);

  if (!frameAnimation || !innerAnimation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-[375px] h-[426px] flex items-center justify-center relative">
        {/* 프레임 애니메이션 (배경) */}
        <div className="absolute inset-0">
          <LottieAnimation
            animationData={frameAnimation}
            style={{ width: '100%', height: '100%' }}
            loop={true}
            autoplay={true}
          />
        </div>
        
        {/* 내부 애니메이션 (흰 박스 중앙에 배치) */}
        <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '65%', width: '200px', height: '200px' }}>
          <LottieAnimation
            animationData={innerAnimation}
            style={{ width: '100%', height: '100%' }}
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
} 