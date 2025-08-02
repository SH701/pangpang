'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const items = [
  { href: "/custom", title: "커스텀 챗봇 설정", desc: "나이/성별/MBTI/주제" },
  { href: "/roleplay", title: "롤플레잉 설정", desc: "캐릭터/시나리오" },
];

export default function Main() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<string>("");

  useEffect(() => {
    const needSetup = params.get("level") === "setup";
    const saved = typeof window !== "undefined" ? localStorage.getItem("userLevel") : null;
    if (needSetup || !saved) setOpen(true);
  }, [params]);

  function saveLevel() {
    if (!level) return;
    localStorage.setItem("userLevel", level);
    setOpen(false);
    router.replace("/main");
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-10">메인페이지</h1>

      <section className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group relative rounded-2xl border bg-white/80 dark:bg-neutral-900/70 shadow hover:shadow-lg transition
                         p-5 h-28 flex flex-col justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <div className="text-lg font-semibold">{it.title}</div>
              <div className="text-sm text-neutral-500">{it.desc}</div>
              <span className="absolute right-4 bottom-4 opacity-60 group-hover:opacity-100">➜</span>
            </Link>
          ))}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow p-6">
            <h2 className="text-xl font-semibold mb-4">레벨 설정</h2>
            <div className="flex flex-col gap-3">
              <select
                className="h-11 rounded-md border px-3 outline-none"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">레벨을 선택하세요</option>
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => router.replace("/")}
                  className="h-10 px-4 rounded-md border"
                >
                  취소
                </button>
                <button
                  onClick={saveLevel}
                  className="h-10 px-4 rounded-md bg-emerald-600 text-white"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
