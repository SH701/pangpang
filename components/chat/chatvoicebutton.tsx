"use client";

import { useState } from "react";
import { MicIcon } from "lucide-react"; // 아이콘 라이브러리, 설치 필요 시 알려줘

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
      className={`p-2 rounded-full border ${
        isRecording ? "bg-red-500 text-white" : "bg-white text-black"
      }`}
    >
      <MicIcon className="w-5 h-5" />
    </button>
  );
}
