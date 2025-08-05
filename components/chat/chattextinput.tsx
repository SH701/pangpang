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
    <input
      type="text"
      className="flex-1 px-4 py-2 border rounded-full outline-none placeholder:text-sm"
      placeholder="존댓말을 알려드릴게요! 질문해 주세요."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
