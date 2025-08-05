'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function LoadingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const meta = user.unsafeMetadata;
    const isSetupDone = meta?.level && meta?.nickname && meta?.interests;

    setTimeout(() => {
      router.push(isSetupDone ? "/main" : "/after");
    }, 1500); // 1.5초 딜레이
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <p className="text-xl font-semibold animate-pulse">로그인 처리 중...</p>
    </div>
  );
}
