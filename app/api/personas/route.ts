// app/api/personas/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  return proxyJSON(req, "/api/personas", {
    method: "POST",
    forwardAuth: true,
  });
}
