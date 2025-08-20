import { NextRequest } from "next/server";
import { proxyJSON } from "../../_lib/proxy";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyJSON(req, `/api/conversations/${id}`, {
    method: "GET",
    forwardAuth: true,
  });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyJSON(req, `/api/conversations/${id}`, {
    method: "DELETE",
    forwardAuth: true,
  });
}
