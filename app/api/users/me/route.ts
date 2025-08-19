// app/api/users/me/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 개발 환경에서는 백엔드 연결 없이 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    return Response.json({
      id: 1,
      email: "dev@example.com",
      nickname: "개발자",
      gender: "남성",
      birthDate: "1990-01-01",
      role: "USER",
      provider: "LOCAL",
      koreanLevel: "Beginner",
      profileImageUrl: "/avatars/avatar1.png",
      interests: ["음식", "여행", "음악"]
    });
  }
  
  return Response.json({ message: "User not found" }, { status: 404 });
}
