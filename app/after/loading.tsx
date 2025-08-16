import { useEffect, useState } from "react";
import WhiteLogo from "@/components/etc/whitelogo";

export default function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500); // 0.5초마다 점 하나씩
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-76">
      <span className="text-6xl font-bold">Welcome!</span>
      <span className="text-gray-300 text-2xl">
        Loading your Noonchi Coach{dots}
      </span>
      <WhiteLogo />
    </div>
  );
}
