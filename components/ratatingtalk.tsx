"use client";

import { useEffect, useState } from "react";

export const talks = [
  { id: 1, talk: "오늘은 저와 어떤 대화를 나눠볼까요?" },
  { id: 2, talk: "편한 말을 입력해 주세요." },
  { id: 3, talk: "존댓말로 바꿔볼게요!" },
];

export default function RotatingTalk() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // 먼저 페이드 아웃
      setVisible(false);

      setTimeout(() => {
        // 문장 바꾸고 페이드 인
        setIndex((prev) => (prev + 1) % talks.length);
        setVisible(true);
      }, 300); // 페이드 아웃 시간과 맞춤
    }, 3000); // 전체 주기

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 flex justify-center items-center overflow-hidden">
      <p
        className={`transition-all duration-300 transform ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3"
        } text-center text-base font-medium`}
      >
        {talks[index].talk}
      </p>
    </div>
  );
}
