// app/api/language/tts/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  return proxyJSON(req, `/api/language/tts`, {
    method: "POST",
    forwardAuth: true, // 필요시 Authorization 전달
    forwardCookies: false,
    extraHeaders: { Accept: "*/*" }, // 오디오/문자열 다 받기 위해
  });
}
