"use client";

import HelperSlider from "@/components/etc/helperslider";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image"

export default function HonorificHelper() {
 
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg max-w-lg mx-auto mt-6">
      
      <div className="flex items-center mb-6">
        <ChevronLeftIcon
          onClick={() => router.push("/main")}
          className="w-6 h-6 text-blue-500 cursor-pointer ml-4"
        />
        <h1 className="text-xl font-semibold ml-4">Honorific helper</h1>
      </div>
      <div className="flex flex-col gap-4 bg-white h-[50vh]">
  <div className="flex-1 p-4 bg-gray-100  my-4 rounded-2xl">
    <div className="h-40">
    <p className="text-xl font-semibold text-gray-300 mb-6">영어부분</p>
    </div>
    <HelperSlider />
    <div className="border-t border-gray-300">
      <p className="text-xl font-semibold text-gray-300 pt-3">한국말 부분</p>
    </div>
  </div>
  </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex gap-2">
        <Image src="/circle/circle4.png" alt="circle" width={28} height={28}/>
        <h3 className="font-semibold text-blue-600">Noonchi Coach</h3>
        </div>
        <p className="text-sm mt-2">
          To your boss: <span className="font-semibold">Did you eat? → 점심 식사하셨나요?</span>
        </p>
        <p className="text-sm mt-2">
          To your parents: <span className="font-semibold">밥 먹었어요?</span> (polite yet warm)
        </p>
        <p className="text-sm mt-2">Keep it short and adapt politely to the situation!</p>
      </div>
    </div>
  );
}
