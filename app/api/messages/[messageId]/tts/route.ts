// app/api/messages/[messageId]/tts/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function PUT(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  return proxyJSON(req, `/api/messages/${messageId}/tts`, {
    method: "PUT",
    forwardAuth: true,       // Authorization 토큰 전달
    forwardCookies: false,   // 필요시 true
    extraHeaders: { Accept: "*/*" }, // 오디오/텍스트 응답 받을 때 문제 없도록
  });
}
