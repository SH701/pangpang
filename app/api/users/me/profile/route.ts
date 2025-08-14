// app/api/users/me/profile/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function PUT(req: NextRequest) {
  console.log('[API:Profile] PUT 요청 수신');
  
  // 기존 헤더에서 Bearer null 같은 값 걸러내기
  let auth = req.headers.get("authorization") || undefined;
  console.log('[API:Profile] 원본 Authorization 헤더:', auth);
  
  if (auth && (/^Bearer\s*$/i.test(auth) || /Bearer\s+null/i.test(auth))) {
    console.log('[API:Profile] 유효하지 않은 Authorization 헤더 형식, undefined로 설정');
    auth = undefined;
  }

  // 쿠키에서 accessToken 읽어서 Bearer 만들기
  if (!auth) {
    console.log('[API:Profile] Authorization 헤더가 없어 쿠키에서 토큰 확인');
    const token = req.cookies.get("accessToken")?.value;
    console.log('[API:Profile] 쿠키에서 찾은 토큰:', token ? '존재함' : '없음');
    
    if (token && token !== "null" && token !== "undefined") {
      auth = `Bearer ${token}`;
      console.log('[API:Profile] 쿠키 토큰으로 Authorization 헤더 설정:', auth);
    }
  }

  // 모든 쿠키 확인
  console.log('[API:Profile] 모든 쿠키:', req.cookies.getAll());
  
  // 최종 헤더 설정 - TypeScript 오류 수정
  const extraHeaders: Record<string, string> = {};
  if (auth) {
    extraHeaders.authorization = auth;
  }
  console.log('[API:Profile] 최종 extraHeaders:', extraHeaders);

  // proxyJSON 호출 시 extraHeaders로 강제로 Authorization 넣기
  console.log('[API:Profile] proxyJSON 호출, 대상 경로:', "/api/users/me/profile");
  return proxyJSON(req, "/api/users/me/profile", {
    method: "PUT",
    forwardAuth: false, // 기존 proxyJSON auth 사용 안 함
    forwardCookies: true,
    devPassthrough: true, // 개발 모드에서도 원본 응답 형식 유지
    extraHeaders,
  });
}
