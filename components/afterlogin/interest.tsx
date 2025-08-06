"use client";

import React from "react";
import { interests } from "@/lib/interests";


interface InterestSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function InterestSelector({ selected, onChange }: InterestSelectorProps) {
  const toggleInterest = (content: string) => {
    if (selected.includes(content)) {
      onChange(selected.filter((c) => c !== content));
    } else {
      onChange([...selected, content]);
    }
  };

  return (
    <div className="space-y-4 flex flex-col gap-20 ">
      <h2 className="text-2xl font-semibold mb-6.5 ml-3.5">Please select your <br /> interests</h2>
      <div className="flex flex-wrap justify-center gap-2 mr-4">
        {interests.map(({ id, content }) => {
          const isActive = selected.includes(content);
          return (
            <button
              key={id}
              onClick={() => toggleInterest(content)}
              className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap
                ${isActive ? 'bg-white text-black border' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
