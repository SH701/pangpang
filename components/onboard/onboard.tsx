"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { slides } from "@/lib/setting";
import { useRouter } from "next/navigation";
import {  useRef, useState } from "react";
import Link from "next/link"
import Image from "next/image";

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
    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm">
      {i + 1}
    </button>
  ),
};

export default function Onboard() {
  const router = useRouter();
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);


  const handleNext = () => {
    if (currentSlide === 4) {
      router.push("/login");
    } else {
      sliderRef.current?.slickNext();
    }
  };

  return (
    <div className="w-full max-w-m bg-white">
      <div className="relative">
      <Slider
        ref={sliderRef}
        {...settings}
        afterChange={(i) => setCurrentSlide(i)}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="flex flex-col text-left p-6">
            <h2 className="text-xl font-bold mt-2">{slide.title}</h2>
            <p className="text-gray-600 mt-1 text-sm">{slide.desc}</p>
            {slide.icon&& <slide.icon className="w-60 h-50 ml-auto mt-30" />}
            {slide.img&& <Image src={slide.img} alt="필살기" width={300} height={150} className="mt-30"/>}
          </div>
        ))}
      </Slider>
      </div>

      <footer className="flex flex-col justify-center items-center mt-10 gap-2">
        <button
          onClick={handleNext}
          className="bg-blue-600 px-30 py-2 rounded-lg cursor-pointer"
        >
          <span className="font-semibold text-white">
            {currentSlide === 4 ? "Continue" : "Next"}
          </span>
        </button>
        <div className="flex gap-2 ">
        <p className="text-sm text-gray-500 ">Already have an account?</p>
        <Link href="/login" className="text-blue-500 text-sm">Log in</Link>
        </div>
      </footer>
    </div>
  );
}
