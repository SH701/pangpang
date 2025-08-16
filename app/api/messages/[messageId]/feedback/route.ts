import { proxyJSON } from "@/app/api/_lib/proxy";
import { NextRequest } from "next/server";

type Ctx = { params: Promise<{ messageId: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { messageId } = await ctx.params;
  return proxyJSON(
    req,
    `/api/messages/${encodeURIComponent(messageId)}/feedback`,
    { method: "POST", forwardAuth: true }
  );
}