import { proxyJSON } from "@/app/api/_lib/proxy";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await context.params;

  return proxyJSON(req, `/api/messages/${messageId}/translate`, {
    method: "PUT",
    forwardAuth: true,
  });
}
