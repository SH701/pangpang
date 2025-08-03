"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const text = "Welcome, Korea!";
  const [title, setTitle] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const finished = index >= text.length;
  useEffect(() => {
    if (finished) return;
    const timeout = setTimeout(() => {
      setTitle((prev) => prev + text[index]);
      setIndex((i) => i + 1);
    }, 100);
    return () => clearTimeout(timeout);
  }, [index, finished, text]);
    useEffect(() => {
    if (finished) {
      setShowCursor(false); 
      return;
    }
    const blink = setInterval(() => {
      setShowCursor((s) => !s);
    }, 100);
    return () => clearInterval(blink);
  }, [finished]);

  return (
   <div
      className={`flex items-center justify-center h-screen transition-all duration-500 ${
        finished ? "sm:text-8xl text-5xl" : "sm:text-5xl text-3xl"
      }`}
    >
      <span>{title}</span>
      <span className="ml-1" style={{ opacity: showCursor ? 1 : 0 }}>
        |
      </span>
    </div>
  );
}
