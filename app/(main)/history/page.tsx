import Link from "next/link";

export default function History() {
  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-3 mt-30">
      <Link
        href="/history"
        className="w-full h-32 flex items-center justify-center rounded-2xl border bg-white shadow hover:shadow-lg transition font-semibold text-lg"
      >
        히스토리
      </Link>
      <Link
        href="/custom-bot"
        className="w-full h-14 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:shadow-md transition text-sm font-medium"
      >
        커스텀 챗봇
      </Link>
      <Link
        href="/roleplay"
        className="w-full h-14 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:shadow-md transition text-sm font-medium"
      >
        롤플레잉
      </Link>
    </div>
  );
}
