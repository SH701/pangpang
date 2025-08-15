import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

type RouteParams = { params: { messageId: string } };

export async function POST(req: NextRequest, context: unknown) {
  const { messageId } = (context as RouteParams).params;

  return proxyJSON(
    req,
    `/api/feedbacks/message/${messageId}`,
    { method: "POST", forwardAuth: true }
  );
}
