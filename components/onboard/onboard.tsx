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
    <div className="min-h-screen bg-white px-4">
      <div className="w-full max-w-sm mx-auto space-y-6">
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
              <div className="w-[274px] h-[62px] flex flex-col items-center justify-center text-center mx-auto">
                <h2 className={`text-center font-pretendard text-2xl font-semibold leading-[130%] text-gray-900 ${
                  slide.id === 3 ? 'tracking-tight' : ''
                }`}>
                  {slide.title}
                </h2>
              </div>
              <div className={`w-full flex flex-col items-center text-center px-4 mx-auto ${
                slide.id === 4 ? 'max-w-[350px]' : 'max-w-[300px]'
              }`}>
                <p className="text-gray-600 mt-5 text-sm leading-7 mb-5">{slide.desc}</p>
              </div>
            </div>
          ))}
        </Slider>

        <div className="pt-8">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-gray-900 transition"
          >
            {currentSlide === 4 ? "Continue" : "Next"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}