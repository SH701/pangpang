// app/api/personas/my/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(req: NextRequest) {
  return proxyJSON(req, "/api/personas/my", {
    method: "GET",
    forwardAuth: true,
  });
}
