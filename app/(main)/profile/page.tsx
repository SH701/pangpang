import UserIcon, { Arrow } from "@/components/icons";
import Link from "next/link";

export default function Profile() {
  return (
    <>
    <main className="min-h-[calc(100vh-80px)] flex items-start justify-center px-4 py-8 mt-20">
      <section className="w-full max-w-md">
        <div className="-mt-10 rounded-2xl bg-white dark:bg-neutral-900 border shadow-md p-5">
          <div className="flex items-center gap-4">
            <div className="shrink-0 grid place-items-center size-16 rounded-full ring-4 ring-white dark:ring-neutral-900 bg-neutral-100 dark:bg-neutral-800">
              <UserIcon className="size-8 text-neutral-500" />
            </div>

            <div className="min-w-0">
              <p className="text-lg font-semibold truncate">닉네임</p>
              <p className="text-sm text-neutral-500 truncate">이메일</p>
            </div>

            <Link
              href="/profile/edit"
              className="ml-auto inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition"
              aria-label="프로필 수정"
            >
              <span className="text-sm font-medium">편집</span>
              <Arrow className="size-5" />
            </Link>
          </div>
          <div className="my-5 h-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              레벨: 초급
            </span>
            <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              알림: ON
            </span>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <form>
            <button type="submit" className="h-11 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition w-full">
              로그아웃
            </button>
          </form>

          <button
            type="button"
            className="h-11 w-full rounded-md bg-red-500 hover:bg-red-400 text-white font-medium border-transparent"
          >
            회원탈퇴
          </button>
        </div>
        <div className="mt-6 grid gap-3">
          <Link
            href="/history"
          >
            대화 히스토리 보기
          </Link>
          <Link
            href="/settings"
          >
            설정
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
