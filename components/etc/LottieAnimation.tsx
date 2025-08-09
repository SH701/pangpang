/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Lottie from 'lottie-react';
import { useRef } from 'react';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onComplete?: () => void;
  speed?: number;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  style,
  className,
  onComplete,
  speed = 1
}: LottieAnimationProps) {
  const lottieRef = useRef<any>(null);

  const defaultOptions = {
    animationData,
    loop,
    autoplay,
    lottieRef,
    onComplete,
    speed
  };

  return (
    <Lottie
      {...defaultOptions}
      style={style}
      className={className}
    />
  );
} 