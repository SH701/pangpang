"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { settings, slides } from "@/lib/onboard";
import Link from "next/link";
import "@/style/button.css"

export default function Onboard() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
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
                {slide.isFinal&&(
                     <div className="flex flex-col w-full gap-3">
          <Link
            href="/create"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          >
            회원가입
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg border shadow hover:shadow-md transition"
          >
            로그인
          </Link>
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
