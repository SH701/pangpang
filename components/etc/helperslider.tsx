"use client";

import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Image from "next/image";

type Props = {
  onChange: (
    intimacy:
      | "closeIntimacyExpressions"
      | "mediumIntimacyExpressions"
      | "distantIntimacyExpressions",
    formality: "lowFormality" | "mediumFormality" | "highFormality"
  ) => void;
};

const steps = [
  <span key="close" className="flex items-center gap-0.5">
    <Image
      src="/etc/down.svg"
      alt="close"
      width={14}
      height={14}
      className="relative top-[2.5px]"
    />
    <span>Close</span>
  </span>,
  <span key="middle"></span>,
  <span key="distant" className="flex items-center gap-0.5 justify-end">
    <span>Distant</span>
    <Image
      src="/etc/up.svg"
      alt="distant"
      width={14}
      height={14}
      className="relative top-[1.5px]"
    />
  </span>,
];

const famSteps = [
  <span key="Low" className="flex items-center gap-0.5">
    <Image
      src="/etc/down.svg"
      alt="close"
      width={14}
      height={14}
      className="relative top-[2.5px]"
    />
    <span>Low</span>
  </span>,
  <span key="middle"></span>,
  <span key="High" className="flex items-center gap-0.5 justify-end">
    <span>High</span>
    <Image
      src="/etc/up.svg"
      alt="distant"
      width={14}
      height={14}
      className="relative top-[1.5px]"
    />
  </span>,
];

export default function HelperSlider({ onChange }: Props) {
  const [showInfo, setShowInfo] = useState(true);
  const [level, setLevel] = useState(1);
  const max = steps.length - 1;
  const percent = (level / max) * 100;
  const [fam, setFam] = useState(1);
  const fMax = famSteps.length - 1;
  const fPercent = (fam / fMax) * 100;
  const handleUpdate = (newLevel: number, newFam: number) => {
    const intimacyMap = [
      "closeIntimacyExpressions",
      "mediumIntimacyExpressions",
      "distantIntimacyExpressions",
    ] as const;
    const formalityMap = [
      "lowFormality",
      "mediumFormality",
      "highFormality",
    ] as const;

    console.log("HelperSlider update:", {
      newLevel,
      newFam,
      intimacy: intimacyMap[newLevel],
      formality: formalityMap[newFam],
    });
    onChange(intimacyMap[newLevel], formalityMap[newFam]);
  };

  return (
    <>
      {showInfo && (
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center bg-white px-3 py-1 text-xs text-gray-600 rounded-full shadow border">
            <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-600" />
            Move the slider to match your situation
          </span>
        </div>
      )}

      <div className="flex justify-center">
        <div className="w-[335px] flex flex-col justify-center items-center rounded-xl bg-white">
          {/* Intimacy Level */}
          <div className="w-[335px] px-6 max-w-md border rounded-xl border-blue-400 bg-[#EFF6FF] pb-6">
            <div className=" py-1">
              <span
                className="font-pretendard"
                style={{
                  color: "var(--Natural-cool-gray-700, #374151)",
                  fontFamily: "Pretendard",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "130%",
                }}
              >
                Intimacy Level
              </span>
            </div>
            <div
              className="relative mb-4 mt-4"
              style={{ height: "16px", width: "100%" }}
            >
              <div
                className="absolute inset-0 bg-gray-200 rounded-full"
                style={{ height: "16px", width: "100%" }}
              />
              {steps.map((_, i) => (
                <div
                  key={`lvl-tick-${i}`}
                  className="absolute top-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 transition-colors"
                  style={{
                    left: `${(i / max) * 100}%`,
                    width: "8px",
                    height: "8px",
                    flexShrink: 0,
                    aspectRatio: "1/1",
                    backgroundColor: "var(--Color-Blue-200, #BFDBFE)",
                    borderRadius: "50%",
                    marginLeft: i === 0 ? "4px" : i === max ? "-4px" : "0px",
                  }}
                />
              ))}
              <div
                className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${percent}%`,
                  height: "16px",
                }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
                style={{ left: `${percent}%`, zIndex: 20 }}
              >
                <div
                  className="rounded-full shadow"
                  style={{
                    width: "28px",
                    height: "28px",
                    flexShrink: 0,
                    backgroundColor: "#FFF",
                    border: "1px solid var(--Color-Blue-700, #1D4ED8)",
                    filter: "drop-shadow(0 4px 4px rgba(59, 107, 240, 0.10))",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={max}
                step={1}
                value={level}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setLevel(v);
                  setShowInfo(false);
                  handleUpdate(v, fam);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Intimacy level"
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-600 pb-2 mb-2 border-b border-gray-300">
              {steps.map((label, i) => (
                <span
                  key={`lvl-label-${i}`}
                  className={`flex-1 ${
                    i === 0
                      ? "text-left"
                      : i === steps.length - 1
                      ? "text-right"
                      : "text-center"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Formality Level */}
            <div className="py-2">
              <span
                className="font-pretendard"
                style={{
                  color: "var(--Natural-cool-gray-700, #374151)",
                  fontFamily: "Pretendard",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "130%",
                }}
              >
                Formality Level
              </span>
            </div>

            <div
              className="relative mb-4"
              style={{ height: "16px", width: "100%" }}
            >
              <div
                className="absolute inset-0 bg-gray-200 rounded-full"
                style={{ height: "16px", width: "100%" }}
              />
              {famSteps.map((_, i) => (
                <div
                  key={`fam-tick-${i}`}
                  className="absolute top-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 transition-colors"
                  style={{
                    left: `${(i / fMax) * 100}%`,
                    width: "8px",
                    height: "8px",
                    flexShrink: 0,
                    aspectRatio: "1/1",
                    backgroundColor: "var(--Color-Blue-200, #BFDBFE)",
                    borderRadius: "50%",
                    marginLeft: i === 0 ? "4px" : i === fMax ? "-4px" : "0px",
                  }}
                />
              ))}
              <div
                className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${fPercent}%`,
                  height: "16px",
                }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
                style={{ left: `${fPercent}%`, zIndex: 20 }}
              >
                <div
                  className="rounded-full shadow"
                  style={{
                    width: "28px",
                    height: "28px",
                    flexShrink: 0,
                    backgroundColor: "#FFF",
                    border: "1px solid var(--Color-Blue-700, #1D4ED8)",
                    filter: "drop-shadow(0 4px 4px rgba(59, 107, 240, 0.10))",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={fMax}
                step={1}
                value={fam}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFam(v);
                  setShowInfo(false);
                  handleUpdate(level, v);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Formality level"
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-600">
              {famSteps.map((label, i) => (
                <span
                  key={`fam-label-${i}`}
                  className={`flex-1 ${
                    i === 0
                      ? "text-left"
                      : i === famSteps.length - 1
                      ? "text-right"
                      : "text-center"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
