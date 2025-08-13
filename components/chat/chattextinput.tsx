"use client";

import { useState } from "react";
import Link from "next/link"

export default function ChatTextInput() {
  const [text, setText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && text.trim()) {
      console.log("전송:", text);
      setText("");
    }
  };

  return (
   <div className="relative w-full">
    <Link href="/main/honorific">
  <input
    type="text"
    className="flex-1 pl-12 pr-12 py-2 border rounded-full outline-none placeholder:text-[13px] placeholder:text-right bg-white border-[#dde8f9] w-[350px]"
    placeholder="I’ll help you with honorifics! Please ask!"
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyDown}
    style={{
      backgroundImage: "url('/circle/circle4.png'), url('/etc/mic.png')",
      backgroundPosition: 'left 12px center, right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '30px 30px, 16px 18px',
    }}
  />
  </Link>
</div>

  );
}
