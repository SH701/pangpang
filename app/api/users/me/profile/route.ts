// app/api/users/me/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function PUT(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('Profile update (dev):', body);
      
      // 성공 응답 반환
      return NextResponse.json({ 
        message: 'Profile updated successfully',
        data: body 
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
  }

  // 기존 헤더에서 Bearer null 같은 값 걸러내기
  let auth = req.headers.get("authorization") || undefined;
  if (auth && (/^Bearer\s*$/i.test(auth) || /Bearer\s+null/i.test(auth))) {
    auth = undefined;
  }

  // 쿠키에서 accessToken 읽어서 Bearer 만들기
  if (!auth) {
    const token = req.cookies.get("accessToken")?.value;
    if (token && token !== "null" && token !== "undefined") {
      auth = `Bearer ${token}`;
    }
  }

  // proxyJSON 호출 시 extraHeaders로 강제로 Authorization 넣기
  return proxyJSON(req, "/api/users/me/profile", {
    method: "PUT",
    forwardAuth: false, // 기존 proxyJSON auth 사용 안 함
    forwardCookies: true,
    extraHeaders: auth ? { authorization: auth } : {},
  });
}
