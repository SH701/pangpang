"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"


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
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent) => {
   router.push('/main/honorific')
  };



  return (
  <div className="flex w-[340px] items-center gap-2 px-2 rounded-[99px] border border-blue-200 bg-white h-13">
  <Link href="/main/honorific" className="flex gap-2">
    <Image src="/circle/circle4.png" alt="circle" width={28} height={28}/>
    <input
      type="text"
      className="outline-none placeholder:text-gray-500 placeholder:text-sm bg-transparent w-[340px]" 
      placeholder="Enter a phrase you want to make polite!"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  </Link>
</div>

  );
}