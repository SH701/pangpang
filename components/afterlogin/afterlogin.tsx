/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { Settings } from "react-slick";
import ProfileChange from "./profilechange";

const DEFAULT_INTERESTS = ["Daily Chat"];

export default function AfterLogin() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const sliderRef = useRef<Slider>(null);
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
  if (!isLoaded || !user) return;
  const meta = user.unsafeMetadata;
  const savedLevel =
    typeof meta.level === "string" ? meta.level : "";
  const savedNickname =
    typeof meta.nickname === "string"
      ? meta.nickname
      : user.fullName ?? "";
  const savedAvatar =
    typeof meta.avatar === "string"
      ? meta.avatar
      : user.imageUrl ?? null;
  const savedInterests = Array.isArray(meta.interests)?
      (meta.interests as unknown[])
        .filter((x): x is string => typeof x === "string")
    : DEFAULT_INTERESTS;

  setLevel(savedLevel);
  setNickname(savedNickname);
  setAvatar(savedAvatar);
  setInterests(savedInterests);
}, [isLoaded, user]);

  const saveMeta = async (data: Record<string, any>) => {
    if (!user) return;
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        ...data,
      },
    });
  };

  const handleNext = async () => {
    if (step === 0 && level) {
      await saveMeta({ level });
    }
    if (step === 1 && (nickname || avatar)) {
      await saveMeta({ nickname, avatar });
    }
    if (step === 2 && interests.length > 0) {
      await saveMeta({ interests });
    }
    if (step === 3) {
     router.push("/main")
      return;
    }
    sliderRef.current?.slickNext();
  };

  const handleSkip = async () => {
    await saveMeta({
      level: "Beginner",       
      interests: DEFAULT_INTERESTS,
    });
    router.push("/main")
    return;
  };

  if (!isLoaded) return null;

  const settings: Settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: false,
    afterChange: (i) => setStep(i),
  };
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Slider ref={sliderRef} {...settings}>
        {/*  레벨 선택 */}
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">Please select your Korean level</h2>
          {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`block w-full py-2 rounded ${
                level === lvl ? 'bg-black text-white' : 'border'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* 프로필 선택 */}
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold mb-10">Please select a profile</h2>
          <ProfileChange user={user} />
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-3/4 p-2 border rounded"
          />
          <h2 className="text-gray-600">Or set your character</h2>
            <div className="flex gap-4 justify-center"> 
            <div className="rounded-full bg-black size-16"></div>
            <div className="rounded-full bg-black size-16"></div>
            <div className="rounded-full bg-black size-16"></div>
            </div>
        </div>

        {/* 관심사 선택 */}
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">Please select your interests</h2>
          {['Daily Chat', 'Business', 'Study', 'Politeness'].map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setInterests((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
              className={`m-1 px-3 py-1 rounded ${
                interests.includes(tag)
                  ? 'bg-black text-white'
                  : 'border'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Ready to start */}
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">Ready to start?</h2>
          <p>Practice honorifics naturally by chatting with K-Etiquette.</p>
        </div>
      </Slider>

      {/* 버튼 그룹 */}
      <div className="mt-6 flex flex-col justify-between gap-2">    
        <button
          onClick={handleNext}
          disabled={
            (step === 0 && !level) ||
            (step === 1 && !nickname && !avatar) ||
            (step === 2 && interests.length === 0)
          }
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
         {step === 3 ? "Start" : "Next"}
        </button>
         <button onClick={handleSkip} className="cursor-pointer underline">
            {step ===3 ? "" :"Skip"}
        </button>
      </div>
    </div>
  );
}
