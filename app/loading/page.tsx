'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MegaphoneIcon } from '@heroicons/react/24/outline';

export default function LoadingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const meta = user.unsafeMetadata;
    const isSetupDone = meta?.level && meta?.nickname && meta?.interests;
    const timer = setTimeout(() => {
      setShowComplete(true);
      setTimeout(() => {
        router.push(isSetupDone ? "/main" : "/after");
      }, 1000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, user]);

  const nickname = user?.unsafeMetadata.username as string

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-center">
      (
        <>
          <div className="w-16 h-16 relative mb-4">
           <MegaphoneIcon className="size-12"/>
          </div>
          <p className="text-green-500 text-sm font-medium">가입 완료!</p>
          <h1 className="text-xl font-bold">{nickname}님, 환영해요</h1>
        </>
      )
    </div>
  );
}
