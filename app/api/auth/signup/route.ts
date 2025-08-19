import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 백엔드 연결 없이 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    if (body.email && body.password) {
      return Response.json({
        message: "User registered successfully",
        user: {
          id: 1,
          email: body.email,
          nickname: body.nickname || "새사용자",
          koreanLevel: "Beginner"
        }
      });
    }
  }
  
  return Response.json({ message: "Registration failed" }, { status: 500 });
}