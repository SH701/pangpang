import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(req: NextRequest) {
  return proxyJSON(req, "/api/messages", { method: "GET", forwardAuth: true });
}
export async function POST(req:NextRequest){
  return proxyJSON(req,"/api/messages",{method:"POST",forwardAuth:true})
}