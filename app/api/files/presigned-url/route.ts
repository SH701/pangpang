// app/api/files/presigned-url/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";


// 2) 실제 POST 요청 프록시
export async function POST(req: NextRequest) {
  // CORS 헤더를 응답에도 포함시키려면 proxyJSON 내부에서 추가 가능하게 수정 가능
  return proxyJSON(req, "/api/files/presigned-url", {
    method: "POST",
    forwardAuth: true, 
  });
}
