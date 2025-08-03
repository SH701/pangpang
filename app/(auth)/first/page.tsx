import Link from "next/link";

export default function First() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <section className="w-full max-w-sm rounded-2xl border bg-white/70 dark:bg-neutral-900/60 shadow p-6 flex flex-col items-center gap-6">
        <h1 className="text-xl font-semibold">온보딩</h1>

        <div className="flex flex-col w-full gap-3">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg border shadow hover:shadow-md transition"
          >
            로그인
          </Link>

          <Link
            href="/create"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          >
            회원가입
          </Link>
        </div>
      </section>
    </main>
  );
}
