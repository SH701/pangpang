"use client";

import { useState } from "react";
import { MicIcon } from "lucide-react"; 

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
      className={`${
        isRecording ? " text-black" : "bg-white text-black"
      }`}
    >
      <MicIcon className="w-7 h-7" />
    </button>
  );
}
