// app/api/messages/[messageId]/honorific-variations/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";
type Ctx = { params: Promise<{ messageId: string }> };
export async function GET(req: NextRequest, ctx: Ctx) {
  const { messageId } = await ctx.params;
  return proxyJSON(
    req,
    `/api/messages/${encodeURIComponent(messageId)}/honorific-variations`,
    { method: "GET", forwardAuth: true }
  );
}
