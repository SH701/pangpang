// app/api/conversations/[id]/feedback/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJSON(
    req,
    `/api/conversations/${encodeURIComponent(id)}/feedback`,
    { method: "GET", forwardAuth: true }
  );
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJSON(
    req,
    `/api/conversations/${encodeURIComponent(id)}/feedback`,
    { method: "POST", forwardAuth: true }
  );
}

// (필요하면) CORS 프리플라이트
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}
