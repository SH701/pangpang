import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 백엔드 연결 없이 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    if (body.email && body.password) {
      return Response.json({
        accessToken: "dev-access-token-123",
        refreshToken: "dev-refresh-token-456",
        user: {
          id: 1,
          email: body.email,
          nickname: "개발자",
          koreanLevel: "Beginner"
        }
      });
    }
  }
  
  return Response.json({ message: "Login failed" }, { status: 500 });
}