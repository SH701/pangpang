// app/api/users/me/profile/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function PUT(req: NextRequest) {
  return proxyJSON(req, "/api/users/me/profile", {
    method: "PUT",
    forwardAuth: true,
    forwardCookies: true,
  });
}
