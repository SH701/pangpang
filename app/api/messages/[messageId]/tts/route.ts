// app/api/messages/[messageId]/tts/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

type RouteContext = {
  params: Promise<{ messageId: string }>; // 👈 Next.js 15부터 Promise
};

export async function PUT(req: NextRequest, context: RouteContext) {
  const { messageId } = await context.params; // 👈 await 필요

  return proxyJSON(req, `/api/messages/${messageId}/tts`, {
    method: "PUT",
    forwardAuth: true,
    forwardCookies: false,
    extraHeaders: { Accept: "*/*" },
  });
}
