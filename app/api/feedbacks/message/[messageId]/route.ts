import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(
  req: NextRequest,
  { params }: { params: { messageId: string } } 
) {
  const { messageId } = params;

  return proxyJSON(
    req,
    `/api/feedbacks/message/${messageId}`,
    { method: "POST", forwardAuth: true }
  );
}
