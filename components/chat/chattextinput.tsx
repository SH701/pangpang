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
      placeholder="I’ll teach you polite speech ask away!"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
