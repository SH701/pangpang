// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    console.log('User profile fetch (dev)');
    
    // mock 사용자 프로필 데이터 반환
    return NextResponse.json({
      id: "dev-user-123",
      email: "dev@example.com",
      nickname: "개발자",
      koreanLevel: "BEGINNER",
      profileImageUrl: "/characters/character1.png",
      interests: ["💬 Daily", "🎵 K-Pop"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 200 });
  }

  return proxyJSON(req, "/api/users/me", {
    method: "GET",
    forwardAuth: true,
  });
}
