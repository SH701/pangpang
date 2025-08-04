/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { setlevel } from "@/lib/setlevel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Level() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/");
      return;
    }
    const levelSet = (user?.unsafeMetadata as any)?.levelSet as boolean | undefined;

    if (levelSet) {
      router.replace("/main");
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleComplete = async () => {
  if (!user || selectedId === null) return;
  setSaving(true);
  try {
    const levelObj = setlevel.find((l) => l.id === selectedId);
    await user.update({
      unsafeMetadata: {
        ...(((user.unsafeMetadata as unknown) as Record<string, any>) || {}),
        levelSet: true,
        level: levelObj?.difficulty ?? null,
      },
    });
    // 저장 끝나면 main으로
    router.push("/main");
  } catch (e) {
    console.error("레벨 저장 실패:", e);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="flex flex-col justify-center items-center gap-6 max-w-md text-center">
        <div className="space-y-1">
          <p className="text-lg font-semibold">영어 스피킹 수준은</p>
          <p className="text-lg font-semibold">어느정도라고 생각하시나요?</p>
          <p className="text-xs text-gray-500 mt-1">
            난이도 변경은 언제든지 가능해요
          </p>
        </div>

        <div className="flex gap-3 w-full">
          {setlevel.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedId(level.id)}
              className={`flex-1 py-3 rounded-md font-medium transition border ${
                selectedId === level.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border-gray-300"
              }`}
              aria-pressed={selectedId === level.id}
              aria-label={level.difficulty}
            >
              {level.difficulty}
            </button>
          ))}
        </div>

        {selectedId && (
          <div className="mt-4">
            <p>
              선택된 수준:{" "}
              <span className="font-bold">
                {setlevel.find((l) => l.id === selectedId)?.difficulty}
              </span>
            </p>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={selectedId === null || saving}
          className={`mt-4 w-full py-3 rounded-lg font-medium transition shadow ${
            selectedId
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {saving ? "저장 중..." : "레벨 설정 완료"}
        </button>
      </div>
    </div>
  );
}
