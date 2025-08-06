/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { Settings } from "react-slick";
import LevelSelector from "./levelselector";
import Skip from "./skip";
import ProfileSelector from "./profileselector";
import NextButton from "./nextbutton";
import InterestSelector from "./interest";

const DEFAULT_INTERESTS = ["Daily Chat"];

export default function AfterLogin() {
  const { user, isLoaded } = useUser();
  const [w, setW] = useState<number | "100%">("100%");
  const router = useRouter();
  const sliderRef = useRef<Slider>(null);
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
  if (!isLoaded || !user) return;
  const meta = user.unsafeMetadata  as Record<string, unknown>;;
  const mapLevel: Record<string, string> = {
    beginner: "1",
    intermediate: "2",
    advanced: "3",
  };
 const rawLevel = meta.level;
   let savedLevel = "";
  if (typeof rawLevel === "string") {
    savedLevel =
      ["1", "2", "3"].includes(rawLevel)
        ? rawLevel
        : mapLevel[rawLevel] ?? "";
  }
  setLevel(savedLevel);
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
  useEffect(()=>{
    const ww = window.innerWidth;
    setW( ww + (ww % 2) ); 
  }, []);
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
      router.push("/main")
      return;
    }
    sliderRef.current?.slickNext();
  };



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
    <>
    <div className="w-full max-w-md mx-auto p-4" style={{ width: typeof w === "number" ? `${w}px` : w }}>
      <Skip/>
      <Slider ref={sliderRef} {...settings}>
          <LevelSelector selected={level} onSelect={setLevel}/>

       <ProfileSelector
            user={user}
            nickname={nickname}
            setNickname={setNickname}
            avatar={avatar}
            setAvatar={setAvatar}
          />

        <InterestSelector
      selected={interests}    
      onChange={setInterests}
        />
      </Slider>

      <NextButton
          step={step}
          level={level}
          nickname={nickname}
          avatar={avatar}
          interests={interests}
          handleNext={handleNext}
        />
      </div>          
      </>
  );
}
