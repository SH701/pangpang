"use client";

import { useState } from "react";
import Image from "next/image"

export default function ChatVoiceButton() {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    if (isRecording) {
      // 음성 인식 중지 로직
      console.log("🛑 음성 인식 중지");
      setIsRecording(false);
    } else {
      // 음성 인식 시작 로직
      console.log("🎤 음성 인식 시작");
      setIsRecording(true);
    }
  };

  return (
    <button
      onClick={handleVoiceInput}
    >
      <Image src="/etc/mic.png" alt="mic" width={16} height={16} />
    </button>
  );
}
