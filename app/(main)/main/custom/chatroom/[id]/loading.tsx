import "@/styles/loading.css"
import Image from "next/image";

export default function Loading() {
    return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px]">
      {/* 텍스트 */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <span className="text-2xl font-semibold">Creating a chat window</span>
        <span className="text-gray-400 text-lg">It won&apos;t take long!</span>
        <span className="text-gray-400 text-lg">Please wait a moment.</span>
      </div>

      {/* 고정 높이 컨테이너 */}
      <div className="flex justify-center gap-8 h-[80px] relative">
        {/* 원 + 그림자 */}
        {[
          { delay: "0s" },
          { delay: ".2s" },
          { delay: ".3s" },
        ].map((item, idx) => (
          <div key={idx} className="relative w-[50px]">
            <div
              className="absolute left-1/2 -translate-x-1/2 animate-circle"
              style={{ animationDelay: item.delay }}
            >
              <Image
                src="/circle/circle4.png"
                alt="circle"
                width={40}
                height={40}
                priority
              />
            </div>
            {/* 그림자 */}
            <div
              className="absolute top-[80px] left-1/2 -translate-x-1/2 w-7 h-1 bg-black/50 rounded-full blur-[1px] animate-shadow"
              style={{ animationDelay: item.delay }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}