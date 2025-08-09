// app/api/files/presigned-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

// 1) CORS 프리플라이트
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

// 2) 실제 POST 요청 프록시
export async function POST(req: NextRequest) {
  // CORS 헤더를 응답에도 포함시키려면 proxyJSON 내부에서 추가 가능하게 수정 가능
  return proxyJSON(req, "/api/files/presigned-url", {
    method: "POST",
    forwardAuth: true, // Authorization 그대로 전달
  });
}
