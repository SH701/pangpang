"use client";
import Logo from "@/components/etc/logo";
import { useEffect, useState } from "react";

export default function Page() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center justify-center w-screen h-dvh bg-blue-500">
      <span className="text-6xl text-white font-bold">Welcome!</span>
      <span className="text-gray-300 text-2xl">
        Loading your Noonchi Coach{dots}
      </span>
      <Logo className="w-[300px] h-[80px]" />
    </div>
  );
}
