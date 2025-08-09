// app/api/users/me/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(req: NextRequest) {
  return proxyJSON(req, "/api/users/me", {
    method: "GET",
    forwardAuth: true,
  });
}
