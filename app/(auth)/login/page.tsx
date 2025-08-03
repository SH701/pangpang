"use client"


import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 여기서 이메일/비번 검증 & 로그인 요청 수행
    // 성공했다고 가정하고 이동:
    router.push("/greet")
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-4 rounded-2xl border bg-white/70 dark:bg-neutral-900/60 shadow p-6">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
          required
        />

        <div className="flex justify-center gap-4 py-2">
          <div className="h-16 w-16 border rounded-full flex items-center justify-center">구글</div>
          <div className="h-16 w-16 border rounded-full flex items-center justify-center">카톡</div>
          <div className="h-16 w-16 border rounded-full flex items-center justify-center">페북</div>
        </div>

        <button
          type="submit"
          className="h-11 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          로그인
        </button>

        <p className="text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/create" className="underline text-emerald-700 dark:text-emerald-400">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
