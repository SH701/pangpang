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
  draggable: false,
  swipe: false,
  dotsClass: "slick-dots custom-dots",
  appendDots: dots => (
      <div className="absolute size-12"> 
        <ul className="flex justify-center space-x-2 bottom-20 }">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-12 h-12 rounded-full bg-gray-300" >
      </button>
    ),
  }

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
    <div className="w-full bg-white">
      <Slider
        ref={sliderRef}
        {...settings}
        afterChange={(i) => setCurrentSlide(i)}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="flex flex-col">
            <div
            className={`w-[375px] h-[426px] flex items-center justify-center ${
            slide.id !== 1 && slide.id !== 5 ? 'bg-[#EFF6FF]' : ''
            }`}>
              {slide.icon&& <slide.icon />}
              {slide.img&&<Image src={slide.img} alt="image" width={300} height={295}/>} 
            </div>
            <div className="w-full max-w-[300px] flex flex-col items-center text-center px-4 mx-auto">
              <h2 className="text-xl font-bold mt-10">{slide.title}</h2>
              <p className="text-gray-600 mt-5 text-sm leading-7 mb-5">{slide.desc}</p>
            </div>
          </div>
        ))}
      </Slider>

      <div className="flex flex-col justify-center items-center mt-15 gap-2 m-0 ">
        <button
          onClick={handleNext}
          className="bg-blue-600 px-30 py-2 rounded-lg cursor-pointer w-[335px]"
        >
          <span className="font-semibold text-white">
            {currentSlide === 4 ? "Continue" : "Next"}
          </span>
        </button>
        <div className="flex gap-2 ">
        <p className="text-sm text-gray-500 ">Already have an account?</p>
        <Link href="/login" className="text-blue-500 text-sm">Log in</Link>
        </div>
      </div>
    </div>
  );
}
