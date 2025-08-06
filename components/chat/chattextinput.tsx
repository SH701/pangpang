"use client";

import { useState } from "react";

export default function ChatTextInput() {
  const [text, setText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && text.trim()) {
      console.log("전송:", text);
      setText("");
    }
  };

  return (
    <> 
    <div className="bg-[#3B6BF0] rounded-full size-7 absolute left-6"/>
    <input
      type="text"
      className="flex-1 px-4 py-2 border rounded-full outline-none placeholder:text-[13px] placeholder:text-right bg-white border-[#dde8f9]"
      placeholder="I’ll help you with honorifics! Please ask!"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
    />
    
    </>
  );
}
