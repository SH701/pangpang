// app/api/personas/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    console.log('Personas fetch (dev)');
    
    // mock 페르소나 데이터 반환
    return NextResponse.json([
      {
        id: "dev-persona-1",
        name: "친근한 친구",
        description: "일상적인 대화를 나눌 수 있는 친구",
        imageUrl: "/characters/character1.png",
        createdAt: new Date().toISOString()
      },
      {
        id: "dev-persona-2", 
        name: "비즈니스 파트너",
        description: "업무와 관련된 대화를 나눌 수 있는 파트너",
        imageUrl: "/characters/character2.png",
        createdAt: new Date().toISOString()
      }
    ], { status: 200 });
  }

  return proxyJSON(req, "/api/personas/my", {
    method: "GET",
    forwardAuth: true,
  });
}
