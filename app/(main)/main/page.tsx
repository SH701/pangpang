"use client";

import { useEffect } from "react";
import Link from "next/link";

const items = [
  { href: "/custom", title: "커스텀 챗봇 설정", desc: "나이/성별/MBTI/주제" },
  { href: "/roleplay", title: "롤플레잉 설정", desc: "캐릭터/시나리오" },
];

export default function Main() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <main
      className="flex flex-col justify-start p-6 w-full mt-10"
      style={{
        height: "calc(var(--vh, 1vh) * 100)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-10 text-center">
          메인페이지
        </h1>
        <section className="flex-1 px-0 pb-8">
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="group relative rounded-2xl border bg-white/80 dark:bg-neutral-900/70 shadow hover:shadow-lg transition
                           p-5 h-28 flex flex-col justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              >
                <div className="text-lg font-semibold">{it.title}</div>
                <div className="text-sm text-neutral-500">{it.desc}</div>
                <span className="absolute right-4 bottom-4 opacity-60 group-hover:opacity-100">
                  ➜
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
