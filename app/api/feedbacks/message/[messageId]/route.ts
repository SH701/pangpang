// app/api/feedbacks/message/[messageId]/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(
  req: NextRequest,
  context: { params: { messageId: string } }
) {
  const { messageId } = context.params;

  return proxyJSON(
    req,
    `/api/feedbacks/message/${messageId}`,
    { method: "POST", forwardAuth: true }
  );
}
