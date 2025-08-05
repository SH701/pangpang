
'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function AuthPageOverlay() {
  return (
    <div className="absolute inset-0 bottom z-10 flex flex-col items-center justify-end gap-4 p-6 mb-0 bg-black/70">
      <div className="bg-blue-100 px-20 py-3 rounded-2xl">
      <h2 className="text-black text-lg font-semibold c">회원가입 해주세요</h2>
      <SignedOut>
        <div className="w-full flex flex-col gap-3">
          <SignUpButton>
            <button className="h-11 w-full rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700">
              회원가입
            </button>
          </SignUpButton>
          <SignInButton>
            <button className="h-11 w-full rounded-lg border shadow hover:shadow-md">
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
