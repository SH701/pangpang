"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
 
export default function Create() {
      const router = useRouter();
    
      async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // 여기서 이메일/비번 검증 & 로그인 요청 수행
        // 성공했다고 가정하고 이동:
        router.push("/greet"); 
      }
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-4 rounded-2xl border bg-white/70 dark:bg-neutral-900/60 shadow p-6">
        <h1 className="text-xl font-semibold text-center">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <input
          type="text"
          placeholder="Nickname"
          className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <input
          type="password"
          placeholder="Password"
          className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
        />

        <div className="flex justify-center gap-4 py-2">
             <div className="h-16 w-16 border rounded-full" ><span className="flex justify-center items-center pt-5">구글</span></div>
          <div className="h-16 w-16 border rounded-full" ><span className="flex justify-center items-center pt-5">카톡</span></div>
          <div className="h-16 w-16 border rounded-full" ><span className="flex justify-center items-center pt-5">페북</span></div>
        </div>

        <button
          type="submit"
          className="h-11 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition cursor-pointer"
        >
          회원가입
        </button>

        <p className="text-center text-sm">
          계정이 있으신가요?{" "}
          <Link href="/login" className="underline text-emerald-700 dark:text-emerald-400">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
