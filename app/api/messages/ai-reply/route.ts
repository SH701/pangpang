import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req:NextRequest){
  return proxyJSON(req,"/api/messages/ai-reply",{method:"POST",forwardAuth:true})
}