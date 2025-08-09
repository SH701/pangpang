// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// ✅ 서버용 ENV 우선 사용, 없으면 NEXT_PUBLIC도 fallback
const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    // 1) ENV 확인
    if (!BASE_URL) {
      // .env.local에 API_URL이 없으면 바로 에러 응답
      return NextResponse.json(
        { message: "API_URL is not set on the server" },
        { status: 500 }
      );
    }

    // 2) body 파싱
    const body = await req.json();

    // 3) URL 안전하게 합치기 (슬래시 누락/중복 방지)
    const url = new URL("/api/auth/login", BASE_URL).toString();

    // 4) 서버→서버 통신이므로 CORS 걱정 X
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // 다음 옵션이 필요하면 사용
      // cache: "no-store",
    });

    // 5) 그대로 프록시
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
