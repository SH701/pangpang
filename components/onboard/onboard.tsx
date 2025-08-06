"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { slides } from "@/lib/setting";
import { useRouter } from "next/navigation";
import {  useRef, useState } from "react";

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
    <div className="w-full max-w-md">
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
          </div>
        ))}
      </Slider>
      </div>

      <div className="flex justify-center items-center mt-10 ">
        <button
          onClick={handleNext}
          className="bg-black px-30 py-2 rounded-lg cursor-pointer"
        >
          <span className="font-semibold text-white">
            {currentSlide === 4 ? "Continue" : "Next"}
          </span>
        </button>
      </div>
    </div>
  );
}
