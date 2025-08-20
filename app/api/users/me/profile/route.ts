// app/api/users/me/profile/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function PUT(req: NextRequest) {
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

  const extraHeaders: Record<string, string> = {};
  if (auth) {
    extraHeaders.authorization = auth;
  }
  return proxyJSON(req, "/api/users/me/profile", {
    method: "PUT",
    forwardAuth: false, // 기존 proxyJSON auth 사용 안 함
    forwardCookies: true,
    extraHeaders,
  });
}
