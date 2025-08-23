import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  return proxyJSON(req, "/api/language/stt", { method: "POST",forwardAuth: true, });
}