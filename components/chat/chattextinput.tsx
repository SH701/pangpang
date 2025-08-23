"use client";

import Link from "next/link";
import Image from "next/image";

export default function ChatTextInput() {
  return (
    <div className="flex w-[340px] items-center gap-2 px-2 rounded-[99px] border border-blue-200 bg-white h-13">
      <Link href="/main/honorific" className="flex gap-2 items-center">
        <Image src="/circle/circle4.png" alt="circle" width={28} height={28} />
        <span className="text-gray-500 text-sm">
          Enter a phrase you want to make polite!
        </span>
      </Link>
    </div>
  );
}
