"use client";

import { useState } from "react";
import { MicIcon } from "lucide-react";
import Link from "next/link";

// 움직이는 눈 아이콘 컴포넌트
const MovingEyesIcon = () => (
  <div className="bg-blue-500 rounded-full size-8 flex items-center justify-center">
    <div className="flex gap-1">
      <div className="w-2 h-1.5 bg-white rounded-full flex items-center justify-center">
        <div className="w-1 h-1 bg-black rounded-full"></div>
      </div>
      <div className="w-2 h-1.5 bg-white rounded-full flex items-center justify-center">
        <div className="w-1 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function ChatTextInput() {
  const [text, setText] = useState("");
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && text.trim()) {
      console.log("전송:", text);
      setText("");
    }
  };



  return (
    <div className="flex w-[340px] px-2 items-center gap-1 flex-shrink-0 rounded-[99px] border border-blue-200 bg-white h-13">
      <Link href="/main/honorific" className="flex gap-4">
      <MovingEyesIcon />
      <input
        type="text"
        className="flex-1 outline-none placeholder:text-gray-500 placeholder:text-sm bg-transparent"
        placeholder="Enter a phrase you want to make more polite!"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="text-blue-500 hover:text-blue-600 transition-colors p-1"
      >
        <MicIcon className="w-5 h-5" />
      </button>
      </Link>
    </div>
  );
}