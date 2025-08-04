"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import {slides } from "@/lib/setting";
import "@/style/button.css";
import "@/style/onboard.css"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const settings: Settings = {
  dots: true,
  infinite: false,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  adaptiveHeight: false,
  dotsClass: "slick-dots custom-dots",
  customPaging: (i: number) => (
    <button
      aria-label={`slide ${i + 1}`}
      className="w-3 h-3 rounded-full bg-gray-500 focus:outline-none"
      type="button"
    />
  ),
  appendDots: (dots: React.ReactNode) => (
    <div>
      <ul className="flex gap-2 mt-4 justify-center">{dots}</ul>
    </div>
  ),
};


export default function Onboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      const levelSet = (user.unsafeMetadata)?.levelSet as boolean | undefined;
      if (!levelSet) {
        router.replace("/greet");
      } else {
        router.replace("/main");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);


  if (isLoaded && isSignedIn) {
    return null;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <div className="w-full max-w-md">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id}>
              <div className="flex flex-col items-center justify-center text-center p-6 min-h-[70vh]">
                <div className="flex-shrink-0 mb-4">
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    width={200}
                    height={200}
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
                <h2 className="text-2xl font-bold mt-2">{slide.title}</h2>
                <p className="text-gray-600 mt-1">{slide.desc}</p>

                {slide.isFinal && (
                  <div className="flex flex-col w-full gap-3 mt-4">
                    <SignedOut>
                      <div className="flex flex-col w-full gap-3">
                        <SignUpButton fallbackRedirectUrl="/greet" forceRedirectUrl="/greet">
                          <button className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition cursor-pointer">
                            회원가입
                          </button>
                        </SignUpButton>
                        <SignInButton fallbackRedirectUrl="/greet" forceRedirectUrl="/greet">
                          <button className="inline-flex h-11 w-full items-center justify-center rounded-lg border shadow hover:shadow-md transition cursor-pointer">
                            로그인
                          </button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="flex justify-center">
                        <UserButton />
                      </div>
                    </SignedIn>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
