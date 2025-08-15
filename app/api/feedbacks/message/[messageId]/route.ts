import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(
  req: NextRequest,
  context: any // 👈 타입 강제 지정
) {
  const { messageId } = context.params;

  return proxyJSON(
    req,
    `/api/feedbacks/message/${messageId}`,
    { method: "POST", forwardAuth: true }
  );
}
