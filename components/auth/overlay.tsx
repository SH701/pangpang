'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function AuthPageOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-end justify-center bg-black/60 px-6 pb-10">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl px-6 py-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">로그인 또는 회원가입</h2>
        <p className="text-sm text-gray-600 mb-6">서비스 이용을 위해 인증이 필요합니다</p>

        <SignedOut>
          <div className="flex flex-col gap-3">
            <SignUpButton forceRedirectUrl="/loading">
              <button className="h-11 w-full  font-semibold  btn">
                회원가입
              </button>
            </SignUpButton>
            <SignInButton forceRedirectUrl="/loading">
              <button className="h-11 w-full   font-semibold transition btn">
                로그인
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
        </SignedIn>
      </div>
    </div>
  );
}
