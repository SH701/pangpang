import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

type FeedbackMessageParams = {
  messageId: string;
};

export async function POST(
  req: NextRequest,
  context: unknown // 직접 타입 지정하지 않음
) {
  // 런타임에서 안전하게 타입 좁히기
  const { messageId } = (context as { params: FeedbackMessageParams }).params;

  return proxyJSON(
    req,
    `/api/feedbacks/message/${messageId}`,
    { method: "POST", forwardAuth: true }
  );
}
