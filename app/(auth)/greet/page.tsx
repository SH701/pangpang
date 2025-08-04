"use client"

import { useRouter } from "next/navigation"
import "@/style/button.css"
import { useUser } from "@clerk/nextjs";

export default function Greet(){
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중…</div>;
    }
    if (!isSignedIn || !user) {
      router.replace("/"); // 필요하면 로그인 페이지로
      return null;
    }
    const name = user.firstName?.trim() || "익명";
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push("/level"); 
      }
     return (
    <main className="min-h-screen flex items-center justify-center p-6 ">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md flex flex-col items-center gap-8 rounded-2xl  shadow-lg p-8"
      >
        <div className="text-center space-y-1">
          <p className="text-base leading-snug">
            반가워요 <span className="font-bold">{name}님</span>
          </p>
          <p className="text-base leading-snug">
            구체적인 커리큘럼을 만들기 위해
          </p>
          <p className="text-base leading-snug">몇가지 질문을 할게요</p>
          <p className="text-base leading-snug">
            시작하기를 눌러주세요
          </p>
        </div>

        <div className="w-44 h-44 bg-gray-300 dark:bg-neutral-700 rounded-full flex-shrink-0" />
        <div className="ml-4">
        <button
          type="submit"
          className="btn PageTitle"
        >
          시작하기
        </button>
        </div>
      </form>
    </main>
  );
}
